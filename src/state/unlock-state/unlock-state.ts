import { inject, injectable } from 'inversify';
import {
  type IAvailableActivitiesState,
  type IAvailableItemsState,
  type IReachedMilestonesState,
  IUnlockSerializedState,
  IUnlockState,
} from './interfaces';
import { TYPES } from '@state/types';

@injectable()
export class UnlockState implements IUnlockState {
  @inject(TYPES.ReachedMilestonesState)
  private _reachedMilestonesState!: IReachedMilestonesState;

  @inject(TYPES.AvailableItemsState)
  private _availableItemsState!: IAvailableItemsState;

  @inject(TYPES.AvailableActivitiesState)
  private _availableActivitiesState!: IAvailableActivitiesState;

  get milestones() {
    return this._reachedMilestonesState;
  }

  get items() {
    return this._availableItemsState;
  }

  get activities() {
    return this._availableActivitiesState;
  }

  recalculate() {
    this._availableItemsState.recalculate();
    this._availableActivitiesState.recalculate();
  }

  async startNewState(): Promise<void> {
    await this._reachedMilestonesState.startNewState();
    await this._availableItemsState.startNewState();
    await this._availableActivitiesState.startNewState();

    this.recalculate();
  }

  async deserialize(serializedState: IUnlockSerializedState): Promise<void> {
    await this._reachedMilestonesState.deserialize(serializedState.milestones);
    await this._availableItemsState.deserialize(serializedState.items);
    await this._availableActivitiesState.deserialize(serializedState.activities);

    this.recalculate();
  }

  serialize(): IUnlockSerializedState {
    return {
      milestones: this._reachedMilestonesState.serialize(),
      items: this._availableItemsState.serialize(),
      activities: this._availableActivitiesState.serialize(),
    };
  }
}
