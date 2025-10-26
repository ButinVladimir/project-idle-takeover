import { inject, injectable } from 'inversify';
import {
  IAvailableActivitiesSerializedState,
  IAvailableActivitiesState,
  type IAvailableSidejobsState,
} from './interfaces';
import { TYPES } from '@state/types';

@injectable()
export class AvailableActivitiesState implements IAvailableActivitiesState {
  @inject(TYPES.AvailableSidejobsState)
  private _availableSidejobs!: IAvailableSidejobsState;

  get sidejobs(): IAvailableSidejobsState {
    return this._availableSidejobs;
  }

  recalculate() {}

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
