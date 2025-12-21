import { BaseController, Milestone } from '@shared/index';

export class CompanyPageController extends BaseController {
  isPrimaryActivityUnlocked(): boolean {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedPrimaryActivity);
  }
}
