import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { IActivitySerializedState, IActivityState } from './interfaces';
import { type ISidejobsState } from './states';

@injectable()
export class ActivityState implements IActivityState {
  @inject(TYPES.SidejobsState)
  private _sidejobs!: ISidejobsState;

  private _assignmentRequested: boolean;

  constructor() {
    this._assignmentRequested = true;
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
    await this._sidejobs.startNewState();
    this.requestReassignment();
  }

  async deserialize(serializedState: IActivitySerializedState): Promise<void> {
    await this._sidejobs.deserialize(serializedState.sidejobs);
    this.requestReassignment();
  }

  serialize(): IActivitySerializedState {
    return {
      sidejobs: this._sidejobs.serialize(),
    };
  }
}
