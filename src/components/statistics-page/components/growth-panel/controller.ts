import { BaseController, Milestone } from '@shared/index';

export class StatisticsGrowthPanelController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone) {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
