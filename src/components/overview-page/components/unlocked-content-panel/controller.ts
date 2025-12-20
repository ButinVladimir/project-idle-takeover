import { BaseController, Milestone } from '@shared/index';

export class OverviewUnlockedContentPanelController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone) {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }

  areProgramsUnlocked() {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedMainframePrograms);
  }

  isCompanyUnlocked() {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedCompanyManagement);
  }

  isPrimaryActivityUnlocked() {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedPrimaryActivity);
  }
}
