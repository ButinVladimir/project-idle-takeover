import { BaseController, Feature, IncomeSource } from '@shared/index';

export class StatisticsMoneyIncomeController extends BaseController {
  getMoneyIncome = (incomeSource: IncomeSource) => {
    return this.globalState.money.getIncome(incomeSource);
  };

  isFeatureUnlocked(feature: Feature): boolean {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
