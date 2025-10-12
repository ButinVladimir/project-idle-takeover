import { BaseController } from '@shared/base-controller';

export class AssignCloneSidejobDialogButtonsController extends BaseController {
  getTotalConnectivity(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }

  getRequiredConnectivity(sidejobName: string): number {
    return this.companyState.sidejobs.getConnectivityRequirement(sidejobName);
  }

  getConnectivityGrowth(districtIndex: number): number {
    return this.growthState.connectivity.getTotalGrowthByDistrict(districtIndex);
  }
}
