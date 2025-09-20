import { IPoint, DistrictType, Faction } from '@shared/index';

export interface IMapGeneratorDistrict {
  index: number;
  name: string;
  startingPoint: IPoint;
  districtType: DistrictType;
  faction: Faction;
  isUnlocked: boolean;
  tier: number;
}
