import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { IActivitySerializedState, IActivityState } from './interfaces';
import {
  type ISidejobsFactory,
  type ISidejobActivityValidator,
  type ISidejobsActivityState,
  type IContractsFactory,
  type IContractActivityValidator,
  type IPrimaryActivityQueue,
  PrimaryActivityState,
} from './states';
import { IClone } from '../clones-state';

@injectable()
export class ActivityState implements IActivityState {
  @inject(TYPES.SidejobsFactory)
  private _sidejobsFactory!: ISidejobsFactory;

  @inject(TYPES.SidejobActivityValidator)
  private _sidejobActivityValidator!: ISidejobActivityValidator;

  @inject(TYPES.SidejobsActivityState)
  private _sidejobsActivity!: ISidejobsActivityState;

  @inject(TYPES.ContractsFactory)
  private _contractsFactory!: IContractsFactory;

  @inject(TYPES.ContractActivityValidator)
  private _contractActivityValidator!: IContractActivityValidator;

  @inject(TYPES.PrimaryActivityQueue)
  private _primaryActivityQueue!: IPrimaryActivityQueue;

  private _assignmentRequested: boolean;
  private _assignedClones: Set<IClone>;

  constructor() {
    this._assignmentRequested = true;
    this._assignedClones = new Set<IClone>();
  }

  get sidejobsFactory() {
    return this._sidejobsFactory;
  }

  get sidejobActivityValidator() {
    return this._sidejobActivityValidator;
  }

  get sidejobsActivity() {
    return this._sidejobsActivity;
  }

  get contractsFactory() {
    return this._contractsFactory;
  }

  get contractActivityValidator() {
    return this._contractActivityValidator;
  }

  get primaryActivityQueue() {
    return this._primaryActivityQueue;
  }

  requestReassignment() {
    this._assignmentRequested = true;
  }

  processTick() {
    this.reassign();
    this._primaryActivityQueue.perform();
    this._sidejobsActivity.perform();
  }

  private reassign() {
    if (!this._assignmentRequested) {
      return;
    }

    this._assignmentRequested = false;

    this._assignedClones.clear();

    this.assignActivePrimaryActivities();
    this.assignFinishedActivities();
    this.assignInactiveActivities();
    this.assignSidejobs();

    this._primaryActivityQueue.filterActivities();
  }

  async startNewState(): Promise<void> {
    await this._sidejobsActivity.startNewState();
    await this._primaryActivityQueue.startNewState();
    this.requestReassignment();
  }

  async deserialize(serializedState: IActivitySerializedState): Promise<void> {
    await this._sidejobsActivity.deserialize(serializedState.sidejobs);
    await this._primaryActivityQueue.deserialize(serializedState.primaryActivityQueue);
    this.requestReassignment();
  }

  serialize(): IActivitySerializedState {
    return {
      sidejobs: this._sidejobsActivity.serialize(),
      primaryActivityQueue: this._primaryActivityQueue.serialize(),
    };
  }

  private assignActivePrimaryActivities() {
    for (const primaryActivity of this._primaryActivityQueue.listActivities()) {
      if (primaryActivity.state !== PrimaryActivityState.active) {
        continue;
      }

      primaryActivity.assignedClones.forEach((clone) => {
        this._assignedClones.add(clone);
      });
    }
  }

  private assignFinishedActivities() {
    for (const primaryActivity of this._primaryActivityQueue.listActivities()) {
      if (primaryActivity.state !== PrimaryActivityState.finishedPerforming) {
        continue;
      }

      if (primaryActivity.assignedClones.some((clone) => this._assignedClones.has(clone))) {
        continue;
      }

      if (primaryActivity.start()) {
        primaryActivity.assignedClones.forEach((clone) => {
          this._assignedClones.add(clone);
        });
      }
    }
  }

  private assignInactiveActivities() {
    for (const primaryActivity of this._primaryActivityQueue.listActivities()) {
      if (primaryActivity.state !== PrimaryActivityState.inactive) {
        continue;
      }

      if (primaryActivity.assignedClones.some((clone) => this._assignedClones.has(clone))) {
        continue;
      }

      if (primaryActivity.start()) {
        primaryActivity.assignedClones.forEach((clone) => {
          this._assignedClones.add(clone);
        });
      }
    }
  }

  private assignSidejobs() {
    for (const sidejobActivity of this._sidejobsActivity.listActivities()) {
      const assignedClone = sidejobActivity.sidejob.assignedClone;

      if (
        this._sidejobActivityValidator.validate(sidejobActivity.sidejob) &&
        !this._assignedClones.has(assignedClone)
      ) {
        sidejobActivity.active = true;
        this._assignedClones.add(assignedClone);
      } else {
        sidejobActivity.active = false;
      }
    }
  }
}
