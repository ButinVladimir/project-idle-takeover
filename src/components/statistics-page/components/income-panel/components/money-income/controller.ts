import { BaseController, Milestone, IncomeSource } from '@shared/index';

export class StatisticsMoneyIncomeController extends BaseController {
  getMoneyIncome = (incomeSource: IncomeSource) => {
    return this.globalState.money.getIncome(incomeSource);
  };

  isMilestoneUnlocked(milestone: Milestone): boolean {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
