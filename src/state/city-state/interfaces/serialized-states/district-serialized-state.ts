import { IPoint } from '@shared/interfaces/point';
import { Faction } from '@shared/types';
import { DistrictUnlockState } from '../../types';
import { IDistrictSerializedParameters } from './parameters/district-serialized-parameters';
import { IDistrictCountersSerializedState } from './contracts';

export interface IDistrictSerializedState {
  name: string;
  startingPoint: IPoint;
  districtType: string;
  state: DistrictUnlockState;
  faction: Faction;
  parameters: IDistrictSerializedParameters;
  counters: IDistrictCountersSerializedState;
}
