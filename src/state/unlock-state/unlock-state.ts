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

  private _recalculationRequested: boolean;

  constructor() {
    this._recalculationRequested = true;
  }

  get milestones() {
    return this._reachedMilestonesState;
  }

  get items() {
    return this._availableItemsState;
  }

  get activities() {
    return this._availableActivitiesState;
  }

  requestRecalculation() {
    this._recalculationRequested = true;
  }

  recalculate() {
    if (!this._recalculationRequested) {
      return;
    }

    this._recalculationRequested = false;

    this._availableItemsState.recalculate();
    this._availableActivitiesState.recalculate();
  }

  async startNewState(): Promise<void> {
    await this._reachedMilestonesState.startNewState();
    await this._availableItemsState.startNewState();
    await this._availableActivitiesState.startNewState();

    this.requestRecalculation();
  }

  async deserialize(serializedState: IUnlockSerializedState): Promise<void> {
    await this._reachedMilestonesState.deserialize(serializedState.milestones);
    await this._availableItemsState.deserialize(serializedState.items);
    await this._availableActivitiesState.deserialize(serializedState.activities);

    this.requestRecalculation();
  }

  serialize(): IUnlockSerializedState {
    return {
      milestones: this._reachedMilestonesState.serialize(),
      items: this._availableItemsState.serialize(),
      activities: this._availableActivitiesState.serialize(),
    };
  }
}
