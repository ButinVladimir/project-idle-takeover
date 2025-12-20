import { BaseController, Milestone } from '@shared/index';

export class ViewportController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone): boolean {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
