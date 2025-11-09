import { IDistrictContractsSerializedState } from '../serialized-states';
import { IDistrictContractsCountersState } from './district-contracts-counters-state';

export interface IDistrictContractsState {
  counters: IDistrictContractsCountersState;
  processTick(): void;
  serialize(): IDistrictContractsSerializedState;
  deserialize(serializedState: IDistrictContractsSerializedState): void;
}
