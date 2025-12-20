import { IPoint } from '@shared/index';

export interface IMapGeneratorDistrict {
  index: number;
  name: string;
  startingPoint: IPoint;
  districtType: string;
  faction: string;
  isUnlocked: boolean;
  tier: number;
}
