import { IExponent } from '@shared/index';
import { IDistrictTypeMultiplierParameters } from './district-type-multiplier-parameters';

export interface IDistrictTypeTemplate {
  captureDifficulty: IExponent;
  activityDifficultyModifier: number;
  parameters: {
    experience: IExponent;
    money: IExponent;
    developmentPoints: IExponent;
    districtTierPoints: {
      requirements: IExponent;
      pointsMultiplier: IExponent;
    };
    synchronization: IExponent;
    connectivity: {
      pointsMultiplier: IExponent;
      programPointsMultiplier: IExponent;
    };
    codeBase: IDistrictTypeMultiplierParameters;
    computationalBase: IDistrictTypeMultiplierParameters;
    rewards: IDistrictTypeMultiplierParameters;
    processCompletionSpeed: IExponent;
    experienceShareMultiplier: IExponent;
  };
}
