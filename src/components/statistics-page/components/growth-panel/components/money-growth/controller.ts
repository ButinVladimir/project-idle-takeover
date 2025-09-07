import { BaseController, Feature, IncomeSource, MS_IN_SECOND } from '@shared/index';

export class StatisticsMoneyGrowthController extends BaseController {
  get moneyTotalGrowth() {
    return this.growthState.money.totalGrowth * MS_IN_SECOND;
  }

  getMoneyGrowthByIncomeSource = (incomeSource: IncomeSource) => {
    return this.growthState.money.getGrowth(incomeSource) * MS_IN_SECOND;
  };

  isFeatureUnlocked(feature: Feature): boolean {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
