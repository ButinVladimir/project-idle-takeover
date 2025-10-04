import { ISerializeable, Faction } from '@shared/index';
import { ICitySerializedState } from './serialized-states/city-serialized-state';
import { IDistrictState } from './district-state';

export interface ICityState extends ISerializeable<ICitySerializedState> {
  districtsCount: number;
  getLayout(): number[][];
  getDistrictState(districtIndex: number): IDistrictState;
  getDistrictConnections(districtIndex: number): Set<number>;
  getDistrictSize(districtIndex: number): number;
  listAvailableDistricts(): IDistrictState[];
  updateDistrictsStateAfterJoiningFaction(faction: Faction): void;
  recalculateDistrictsState(): void;
  recalculate(): void;
}
