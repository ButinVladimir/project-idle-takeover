import { BaseController, Milestone } from '@shared/index';

export class AssignCloneSidejobDialogRewardsController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone) {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
