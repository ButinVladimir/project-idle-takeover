import { inject, injectable } from 'inversify';
import { decorators } from '@state/container';
import {
  type IAvailableActivitiesState,
  type IAvailableItemsState,
  type IUnlockedFeaturesState,
  IUnlockSerializedState,
  IUnlockState,
} from './interfaces';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';

const { lazyInject } = decorators;

@injectable()
export class UnlockState implements IUnlockState {
  @inject(TYPES.UnlockedFeaturesState)
  private _unlockedFeaturesState!: IUnlockedFeaturesState;

  @inject(TYPES.AvailableItemsState)
  private _availableItemsState!: IAvailableItemsState;

  @inject(TYPES.AvailableActivitiesState)
  private _availableActivitiesState!: IAvailableActivitiesState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  private _recalculationRequested: boolean;

  constructor() {
    this._recalculationRequested = true;
  }

  get features() {
    return this._unlockedFeaturesState;
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
    await this._unlockedFeaturesState.startNewState();
    await this._availableItemsState.startNewState();
    await this._availableActivitiesState.startNewState();

    this.requestRecalculation();
  }

  async deserialize(serializedState: IUnlockSerializedState): Promise<void> {
    await this._unlockedFeaturesState.deserialize(serializedState.features);
    await this._availableItemsState.deserialize(serializedState.items);
    await this._availableActivitiesState.deserialize(serializedState.activities);

    this.requestRecalculation();
  }

  serialize(): IUnlockSerializedState {
    return {
      features: this._unlockedFeaturesState.serialize(),
      items: this._availableItemsState.serialize(),
      activities: this._availableActivitiesState.serialize(),
    };
  }
}
