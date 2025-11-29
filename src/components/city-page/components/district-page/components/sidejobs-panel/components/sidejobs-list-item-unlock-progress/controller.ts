import { BaseController } from '@shared/index';

export class CityDistrictSidejobsListItemUnlockProgressController extends BaseController {
  getCurrentConnectivity(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }

  getRequiredConnectivity(sidejobName: string) {
    return this.activityState.sidejobActivityValidator.getConnectivityRequirement(sidejobName);
  }

  getConnectivityGrowth(districtIndex: number) {
    return this.growthState.connectivity.getTotalGrowthByDistrict(districtIndex);
  }
}
