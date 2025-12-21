import { BaseController } from '@shared/index';
import { ISidejob, SidejobValidationResult } from '@state/activity-state';

export class AssignCloneSidejobDialogButtonsController extends BaseController {
  getTotalConnectivity(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }

  getRequiredConnectivity(sidejobName: string): number {
    return this.activityState.sidejobActivityValidator.getConnectivityRequirement(sidejobName);
  }

  getConnectivityGrowth(districtIndex: number): number {
    return this.growthState.connectivity.getTotalGrowthByDistrict(districtIndex);
  }

  validateSidejob(sidejob: ISidejob): SidejobValidationResult {
    return this.activityState.sidejobActivityValidator.validate(sidejob);
  }
}
