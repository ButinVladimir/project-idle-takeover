import { inject, injectable } from 'inversify';
import {
  IAvailableActivitiesSerializedState,
  IAvailableActivitiesState,
  type IAvailableCategoryActivitiesState,
} from './interfaces';
import { TYPES } from '@state/types';

@injectable()
export class AvailableActivitiesState implements IAvailableActivitiesState {
  @inject(TYPES.AvailableSidejobsState)
  private _availableSidejobs!: IAvailableCategoryActivitiesState;

  @inject(TYPES.AvailableContractsState)
  private _availableContracts!: IAvailableCategoryActivitiesState;

  get sidejobs(): IAvailableCategoryActivitiesState {
    return this._availableSidejobs;
  }

  get contracts(): IAvailableCategoryActivitiesState {
    return this._availableContracts;
  }

  recalculate() {
    this._availableSidejobs.recalculate();
    this._availableContracts.recalculate();
  }

  async startNewState(): Promise<void> {
    await this._availableSidejobs.startNewState();
    await this._availableContracts.startNewState();
  }

  async deserialize(serializedState: IAvailableActivitiesSerializedState): Promise<void> {
    await this._availableSidejobs.deserialize(serializedState.sidejobs);
    await this._availableContracts.deserialize(serializedState.contracts);
  }

  serialize(): IAvailableActivitiesSerializedState {
    return {
      sidejobs: this._availableSidejobs.serialize(),
      contracts: this._availableContracts.serialize(),
    };
  }
}
