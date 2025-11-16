import { IDistrictContractsCountersSerializedState } from './district-contracts-counters-serialized-state';
import { IDistrictContractsTeamsSerializedState } from './district-contracts-teams-serialized-state';

export interface IDistrictContractsSerializedState {
  counters: IDistrictContractsCountersSerializedState;
  teams: IDistrictContractsTeamsSerializedState;
}
