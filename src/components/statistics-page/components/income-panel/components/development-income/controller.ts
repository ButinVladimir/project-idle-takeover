import { BaseController, Feature, IncomeSource } from '@shared/index';

export class StatisticsDevelopmentIncomeController extends BaseController {
  getDevelopmentIncome = (incomeSource: IncomeSource) => {
    return this.globalState.development.getIncome(incomeSource);
  };

  isFeatureUnlocked(feature: Feature): boolean {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
