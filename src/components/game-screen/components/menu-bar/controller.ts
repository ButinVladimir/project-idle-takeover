import { BaseController, Milestone } from '@shared/index';

export class MenuBarController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone): boolean {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
