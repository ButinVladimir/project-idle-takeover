import { BaseController, Milestone } from '@shared/index';
import { IDistrictState } from '@state/city-state';

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

  areDistrictsAvailable() {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedCompanyManagement);
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getDistrictMultiplier(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.experienceShareMultiplier.value;
  }
}
