import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class StatisticsInfluencePointsGrowthController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getGrowthByDistrict(districtIndex: number): number {
    return this.growthState.influence.getGrowthByDistrict(districtIndex);
  }
}
