import { IExponent, RewardParameterWithBase } from '@shared/index';
import { DistrictTypeRewardParameter } from '../types';

export interface IDistrictTypeTemplate {
  activityRequirementModifier: number;
  primaryActivityimeMultipliers: {
    completionTime: number;
    generationTime: number;
  };
  synchronization: IExponent;
  parameters: Record<
    DistrictTypeRewardParameter,
    {
      progression: IExponent;
      exponent: number;
    }
  >;
  requirements: {
    influence: IExponent;
  };
  multiplierParameterBases: Record<RewardParameterWithBase, number>;
}
