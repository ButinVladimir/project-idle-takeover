import { IExponent, RewardParameterWithBase, DistrictTypeRewardParameter, ILinear } from '@shared/index';

export interface IDistrictTypeTemplate {
  activityRequirementModifier: number;
  primaryActivityTimeMultipliers: {
    contractGenerationTime: number;
  };
  synchronization: ILinear;
  parameters: Record<
    DistrictTypeRewardParameter,
    {
      progression: ILinear;
      exponent: number;
    }
  >;
  requirements: {
    influence: IExponent;
  };
  multiplierParameterBases: Record<RewardParameterWithBase, number>;
}
