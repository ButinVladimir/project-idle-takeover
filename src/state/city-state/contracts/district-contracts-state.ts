import {
  IDistrictContractsCountersState,
  IDistrictContractsSerializedState,
  IDistrictContractsState,
  IDistrictState,
} from '../interfaces';
import { DistrictContractsCountersState } from './district-contracts-counters-state';

export class DistrictContractsState implements IDistrictContractsState {
  private _counters: IDistrictContractsCountersState;

  private _districtState: IDistrictState;

  constructor(districtState: IDistrictState) {
    this._districtState = districtState;

    this._counters = new DistrictContractsCountersState(this._districtState);
  }

  get counters(): IDistrictContractsCountersState {
    return this._counters;
  }

  processTick(): void {
    this._counters.processTick();
  }

  serialize(): IDistrictContractsSerializedState {
    return {
      counters: this.counters.serialize(),
    };
  }

  deserialize(serializedState: IDistrictContractsSerializedState): void {
    this.counters.deserialize(serializedState.counters);
  }
}
