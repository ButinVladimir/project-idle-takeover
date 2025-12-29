import { Milestone, BaseController } from '@shared/index';

export class ClonesSynchronizationValuesController extends BaseController {
  get availableSynchronization(): number {
    return this.globalState.synchronization.availableValue;
  }

  get totalSynchronization(): number {
    return this.globalState.synchronization.totalValue;
  }

  get experienceShareMultiplier(): number {
    return this.globalState.experienceShare.totalMultiplier;
  }

  isExperienceShareUnlocked(): boolean {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedExperienceShare);
  }
}
