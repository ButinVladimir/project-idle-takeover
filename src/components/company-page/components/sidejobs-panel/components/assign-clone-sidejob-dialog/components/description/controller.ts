import { BaseController } from '@shared/base-controller';

export class AssignCloneSidejobDialogDescriptionController extends BaseController {
  getTotalConnectivity(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }

  getRequiredConnectivity(sidejobName: string): number {
    return this.companyState.sidejobs.getConnectivityRequirement(sidejobName);
  }
}
