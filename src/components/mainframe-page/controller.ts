import { BaseController, Milestone } from '@shared/index';

export class MainframePageController extends BaseController {
  isMainframeHardwareUnlocked(): boolean {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedMainframeHardware);
  }

  isMainframeProgramsUnlocked(): boolean {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedMainframePrograms);
  }
}
