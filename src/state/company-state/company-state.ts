import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { ICompanySerializedState, ICompanyState } from './interfaces';
import { type ICloneFactory, type ICompanyClonesState, type ICompanySidejobsState } from './states';

@injectable()
export class CompanyState implements ICompanyState {
  @inject(TYPES.CloneFactory)
  private _cloneFactory!: ICloneFactory;

  @inject(TYPES.CompanyClonesState)
  private _clones!: ICompanyClonesState;

  @inject(TYPES.CompanySidejobsState)
  private _sidejobs!: ICompanySidejobsState;

  private _assignmentRequested: boolean;

  constructor() {
    this._assignmentRequested = true;
  }

  get cloneFactory() {
    return this._cloneFactory;
  }

  get clones() {
    return this._clones;
  }

  get sidejobs() {
    return this._sidejobs;
  }

  requestReassignment() {
    this._assignmentRequested = true;
  }

  processTick() {
    this.reassign();
    this._sidejobs.perform();
    this._clones.recalculateClones();
  }

  private reassign() {
    if (!this._assignmentRequested) {
      return;
    }

    this._assignmentRequested = false;

    this.sidejobs.filterSidejobs();

    for (const sidejob of this._sidejobs.listSidejobs()) {
      const prevState = sidejob.isActive;
      const newState = true;
      sidejob.isActive = true;

      if (newState !== prevState) {
        sidejob.handlePerformanceUpdate();
      }
    }
  }

  async startNewState(): Promise<void> {
    await this._clones.startNewState();
    await this._sidejobs.startNewState();
    this.requestReassignment();
  }

  async deserialize(serializedState: ICompanySerializedState): Promise<void> {
    await this._clones.deserialize(serializedState.clones);
    await this._sidejobs.deserialize(serializedState.sidejobs);
    this.requestReassignment();
  }

  serialize(): ICompanySerializedState {
    return {
      clones: this._clones.serialize(),
      sidejobs: this._sidejobs.serialize(),
    };
  }
}
