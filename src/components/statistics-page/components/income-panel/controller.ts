import { BaseController, Milestone } from '@shared/index';

export class StatisticsIncomePanelController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone) {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
