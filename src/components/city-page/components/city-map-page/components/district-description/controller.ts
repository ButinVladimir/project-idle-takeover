import { BaseController, Milestone } from '@shared/index';

export class CityMapDistrictDescriptionController extends BaseController {
  getDistrictState(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex);
  }

  isInfluenceUnlocked(): boolean {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedInfluence);
  }

  areFactionsUnlocked(): boolean {
    return this.unlockState.milestones.isMilestoneReached(Milestone.unlockedFactions);
  }
}
