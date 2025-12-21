import { BaseController, Milestone, IncomeSource } from '@shared/index';

export class StatisticsDevelopmentIncomeController extends BaseController {
  getDevelopmentIncome = (incomeSource: IncomeSource) => {
    return this.globalState.development.getIncome(incomeSource);
  };

  isMilestoneUnlocked(milestone: Milestone): boolean {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
