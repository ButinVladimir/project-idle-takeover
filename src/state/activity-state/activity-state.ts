import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { IActivitySerializedState, IActivityState } from './interfaces';
import {
  ISidejobActivity,
  type ISidejobsFactory,
  type ISidejobActivityValidator,
  type ISidejobsActivityState,
  type IContractsFactory,
  type IContractActivityValidator,
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

  requestReassignment() {
    this._assignmentRequested = true;
  }

  processTick() {
    this.reassign();
    this._sidejobsActivity.perform();
  }

  private reassign() {
    if (!this._assignmentRequested) {
      return;
    }

    this._assignmentRequested = false;

    this._assignedClones.clear();

    for (const sidejobActivity of this._sidejobsActivity.listActivities()) {
      this.tryAssignSidejob(sidejobActivity);
    }
  }

  async startNewState(): Promise<void> {
    await this._sidejobsActivity.startNewState();
    this.requestReassignment();
  }

  async deserialize(serializedState: IActivitySerializedState): Promise<void> {
    await this._sidejobsActivity.deserialize(serializedState.sidejobs);
    this.requestReassignment();
  }

  serialize(): IActivitySerializedState {
    return {
      sidejobs: this._sidejobsActivity.serialize(),
    };
  }

  private tryAssignSidejob(sidejobActivity: ISidejobActivity) {
    const assignedClone = sidejobActivity.sidejob.assignedClone;

    if (this._sidejobActivityValidator.validate(sidejobActivity.sidejob) && !this._assignedClones.has(assignedClone)) {
      sidejobActivity.active = true;
      this._assignedClones.add(assignedClone);
    } else {
      sidejobActivity.active = false;
    }
  }
}
