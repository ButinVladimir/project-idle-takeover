import { inject, injectable } from 'inversify';
import { IAvailableActivitiesSerializedState, IAvailableActivitiesState, type IAvailableSidejobsState } from './interfaces';
import { TYPES } from '@/state/types';

@injectable()
export class AvailableActivitiesState implements IAvailableActivitiesState {
  private _availableSidejobs: IAvailableSidejobsState;

  private _recalculationRequested: boolean;

  constructor(@inject(TYPES.AvailableSidejobsState) _availableSidejobs: IAvailableSidejobsState) {
    this._availableSidejobs = _availableSidejobs;

    this._recalculationRequested = true;
  }

  get sidejobs(): IAvailableSidejobsState {
    return this._availableSidejobs;
  }

  requestRecalculation() {
    this._recalculationRequested = true;
  }

  recalculate() {
    if (!this._recalculationRequested) {
      return;
    }

    this._recalculationRequested = false;
  }

  async startNewState(): Promise<void> {
    await this._availableSidejobs.startNewState();
  }

  async deserialize(serializedState: IAvailableActivitiesSerializedState): Promise<void> {
    await this._availableSidejobs.deserialize(serializedState.sidejobs);
  }

  serialize(): IAvailableActivitiesSerializedState {
    return {
      sidejobs: this._availableSidejobs.serialize(),
    };
  }
}
