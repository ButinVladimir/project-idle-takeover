import { IExponent } from '@shared/interfaces';

export interface IDistrictTypeMultiplierParameters {
  pointsMultiplier: IExponent;
  pointsToSoftCap: number;
  logBase: number;
}
