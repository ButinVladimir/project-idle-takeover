import { BaseController } from '@shared/base-controller';

export class StatisticsExperienceShareController extends BaseController {
  get baseMultiplier() {
    return this.globalState.experienceShare.baseMultiplier;
  }

  get multiplierBySynchronization() {
    return this.globalState.experienceShare.synchronizationMultiplier;
  }

  get multiplierByProgram() {
    return this.globalState.experienceShare.programMultiplier;
  }

  get totalMultiplier() {
    return this.globalState.experienceShare.totalMultiplier;
  }
}
