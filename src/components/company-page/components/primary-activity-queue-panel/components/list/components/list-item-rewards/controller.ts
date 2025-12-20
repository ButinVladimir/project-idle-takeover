import { BaseController, Milestone } from '@shared/index';

export class PrimaryActivityQueueListItemDescriptionController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone): boolean {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
