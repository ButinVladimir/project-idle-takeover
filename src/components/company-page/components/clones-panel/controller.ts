import { Feature, BaseController } from '@shared/index';

export class ClonesPanelController extends BaseController {
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
    return this.unlockState.features.isFeatureUnlocked(Feature.experienceShare);
  }
}
