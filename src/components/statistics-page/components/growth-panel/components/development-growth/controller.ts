import { BaseController, Milestone, IncomeSource, MS_IN_SECOND } from '@shared/index';

export class StatisticsDevelopmentGrowthController extends BaseController {
  get developmentTotalGrowth() {
    return this.growthState.development.totalGrowth * MS_IN_SECOND;
  }

  getDevelopmentGrowthByIncoumeSource = (incomeSource: IncomeSource) => {
    return this.growthState.development.getGrowth(incomeSource) * MS_IN_SECOND;
  };

  isMilestoneUnlocked(milestone: Milestone): boolean {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
