import { IExponent, RewardParameterWithBase, DistrictTypeRewardParameter } from '@shared/index';

export interface IDistrictTypeTemplate {
  activityRequirementModifier: number;
  primaryActivityTimeMultipliers: {
    contractGenerationTime: number;
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
