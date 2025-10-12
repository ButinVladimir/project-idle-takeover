import { IPoint } from '@shared/interfaces/point';
import { Faction } from '@shared/types';
import { DistrictUnlockState } from '../../types';
import { IDistrictSerializedParameters } from './district-serialized-parameters';

export interface IDistrictSerializedState {
  name: string;
  startingPoint: IPoint;
  districtType: string;
  state: DistrictUnlockState;
  faction: Faction;
  parameters: IDistrictSerializedParameters;
}
