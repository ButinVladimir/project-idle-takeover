import { BaseController } from '@shared/index';

export class AssignCloneSidejobDialogDescriptionController extends BaseController {
  getTotalConnectivity(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }

  getRequiredConnectivity(sidejobName: string): number {
    return this.activityState.sidejobActivityValidator.getConnectivityRequirement(sidejobName);
  }
}
