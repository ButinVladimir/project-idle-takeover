import { IPoint, Faction } from '@shared/index';
import { DistrictUnlockState } from '../types';

export interface IDistrictArguments {
  index: number;
  name: string;
  startingPoint: IPoint;
  districtType: string;
  state: DistrictUnlockState;
  faction: Faction;
}
