import {
  IDistrictContractsCountersState,
  IDistrictCountersSerializedState,
  IDistrictCountersState,
  IDistrictState,
} from '../interfaces';
import { DistrictContractsCountersState } from './district-contracts-counters-state';

export class DistrictCountersState implements IDistrictCountersState {
  private _contracts: IDistrictContractsCountersState;

  private _districtState: IDistrictState;

  constructor(districtState: IDistrictState) {
    this._districtState = districtState;

    this._contracts = new DistrictContractsCountersState(this._districtState);
  }

  get contracts(): IDistrictContractsCountersState {
    return this._contracts;
  }

  processTick(): void {
    this._contracts.processTick();
  }

  serialize(): IDistrictCountersSerializedState {
    return {
      contracts: this._contracts.serialize(),
    };
  }

  deserialize(serializedState: IDistrictCountersSerializedState): void {
    this._contracts.deserialize(serializedState.contracts);
  }

  removeAllEventListeners() {
    this._contracts.removeAllEventListeners();
  }
}
