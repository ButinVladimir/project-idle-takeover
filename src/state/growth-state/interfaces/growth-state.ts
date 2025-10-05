import {
  IMultipliersGrowthState,
  IDevelopmentGrowthState,
  IMoneyGrowthState,
  IConnectivityGrowthState,
  IInfluenceGrowthState,
  IExperienceGrowthState,
  IRewardsGrowthState,
} from './parameters';

export interface IGrowthState {
  money: IMoneyGrowthState;
  development: IDevelopmentGrowthState;
  multipliers: IMultipliersGrowthState;
  connectivity: IConnectivityGrowthState;
  rewards: IRewardsGrowthState;
  influence: IInfluenceGrowthState;
  experience: IExperienceGrowthState;
  resetValues(): void;
  clearValues(): void;
}
