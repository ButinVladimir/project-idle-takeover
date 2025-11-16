import { IDistrictContractsSerializedState } from '../serialized-states';
import { IDistrictContractsCountersState } from './district-contracts-counters-state';
import { IDistrictContractsTeamsState } from './district-contracts-teams-state';

export interface IDistrictContractsState {
  counters: IDistrictContractsCountersState;
  teams: IDistrictContractsTeamsState;
  processTick(): void;
  serialize(): IDistrictContractsSerializedState;
  deserialize(serializedState: IDistrictContractsSerializedState): void;
  removeAllEventListeners(): void;
}
