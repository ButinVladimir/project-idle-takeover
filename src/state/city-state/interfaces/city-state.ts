import { ISerializeable } from '@shared/index';
import { ICitySerializedState } from './serialized-states/city-serialized-state';
import { IDistrictState } from './district-state';

export interface ICityState extends ISerializeable<ICitySerializedState> {
  districtsCount: number;
  getLayout(): number[][];
  getDistrictState(districtIndex: number): IDistrictState;
  getDistrictConnections(districtIndex: number): Set<number>;
  getDistrictSize(districtIndex: number): number;
  getCapturedDistrictsCount(): number;
  listAvailableDistricts(): IDistrictState[];
  updateDistrictsStateAfterJoiningFaction(): void;
  recalculateDistrictsState(): void;
  recalculate(): void;
}
