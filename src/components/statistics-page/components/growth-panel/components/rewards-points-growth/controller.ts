import { IDistrictState } from '@state/city-state';
import { BaseController, MS_IN_SECOND } from '@shared/index';

export class StatisticsRewardsPointsGrowthController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getGrowthByProgram() {
    return this.growthState.rewards.growthByProgram * MS_IN_SECOND;
  }

  getGrowthByDistrict(districtIndex: number) {
    return this.growthState.rewards.getGrowthByDistrict(districtIndex) * MS_IN_SECOND;
  }
}
