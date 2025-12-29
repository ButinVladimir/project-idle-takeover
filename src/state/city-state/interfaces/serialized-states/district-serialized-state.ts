import { IPoint } from '@shared/index';
import { DistrictUnlockState } from '../../types';
import { IDistrictSerializedParameters } from './parameters/district-serialized-parameters';
import { IDistrictCountersSerializedState } from './contracts';

export interface IDistrictSerializedState {
  name: string;
  startingPoint: IPoint;
  districtType: string;
  state: DistrictUnlockState;
  faction: string;
  parameters: IDistrictSerializedParameters;
  counters: IDistrictCountersSerializedState;
}
