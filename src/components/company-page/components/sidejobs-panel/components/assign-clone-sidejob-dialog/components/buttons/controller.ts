import { BaseController } from '@shared/index';

export class AssignCloneSidejobDialogButtonsController extends BaseController {
  getTotalConnectivity(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }

  getRequiredConnectivity(sidejobName: string): number {
    return this.activityState.sidejobs.getConnectivityRequirement(sidejobName);
  }

  getConnectivityGrowth(districtIndex: number): number {
    return this.growthState.connectivity.getTotalGrowthByDistrict(districtIndex);
  }
}
