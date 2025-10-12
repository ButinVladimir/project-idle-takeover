import { IPoint, Faction } from '@shared/index';

export interface IMapGeneratorDistrict {
  index: number;
  name: string;
  startingPoint: IPoint;
  districtType: string;
  faction: Faction;
  isUnlocked: boolean;
  tier: number;
}
