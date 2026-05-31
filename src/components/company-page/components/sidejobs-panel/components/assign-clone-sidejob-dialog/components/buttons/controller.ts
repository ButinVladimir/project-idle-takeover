import { BaseController } from '@shared/index';
import { ISidejob, SidejobsBatchValidationResult } from '@state/activity-state';

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

  getExistingSidejobByClone(cloneId: string): ISidejob | undefined {
    return this.activityState.sidejobsActivity.getActivityByCloneId(cloneId)?.sidejob;
  }

  validateSidejobsBatch(sidejobName: string, districtIndex: number, cloneIds: string[]): SidejobsBatchValidationResult {
    const district = this.cityState.getDistrictState(districtIndex);
    const clones = cloneIds.map((cloneId) => {
      const clone = this.clonesState.ownedClones.getCloneById(cloneId);

      if (!clone) {
        throw new Error(`Clone with id ${cloneId} not found`);
      }

      return clone;
    });

    return this.activityState.sidejobActivityValidator.validateSidejobsBatch(sidejobName, district, clones);
  }
}
