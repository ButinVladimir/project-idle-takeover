import {
  IMultipliersGrowthState,
  IDevelopmentGrowthState,
  IMoneyGrowthState,
  IConnectivityGrowthState,
  IDistrictTierPointsGrowthState,
  IExperienceGrowthState,
  IRewardsGrowthState,
} from './parameters';

export interface IGrowthState {
  money: IMoneyGrowthState;
  development: IDevelopmentGrowthState;
  multipliers: IMultipliersGrowthState;
  connectivity: IConnectivityGrowthState;
  rewards: IRewardsGrowthState;
  districtTierPoints: IDistrictTierPointsGrowthState;
  experience: IExperienceGrowthState;
  resetValues(): void;
  clearValues(): void;
}
