import { IDistrictCountersSerializedState } from '../serialized-states';
import { IDistrictContractsCountersState } from './district-contracts-counters-state';

export interface IDistrictCountersState {
  contracts: IDistrictContractsCountersState;
  processTick(): void;
  serialize(): IDistrictCountersSerializedState;
  deserialize(serializedState: IDistrictCountersSerializedState): void;
  removeAllEventListeners(): void;
}
