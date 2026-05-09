import { ISidejob, SidejobsBatchValidationResult } from '@state/activity-state';
import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class AssignCloneSidejobDialogController extends BaseController {
  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  listAvailableSidejobs(): string[] {
    return this.unlockState.activities.sidejobs.listAvailableActivities();
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getExistingSidejobByClone(cloneId: string): ISidejob | undefined {
    return this.activityState.sidejobsActivity.getActivityByCloneId(cloneId)?.sidejob;
  }

  assignSidejobsBatch(sidejobName: string, districtIndex: number, cloneIds: string[]) {
    const district = this.cityState.getDistrictState(districtIndex);
    const clones = cloneIds.map((cloneId) => {
      const clone = this.clonesState.ownedClones.getCloneById(cloneId);

      if (!clone) {
        throw new Error(`Clone with id ${cloneId} not found`);
      }

      return clone;
    });

    this.activityState.sidejobsActivity.assignSidejobs(sidejobName, district, clones);
  }

  validateSidejobsBatch(sidejobName: string, districtIndex: number, cloneIds: string[]): boolean {
    const district = this.cityState.getDistrictState(districtIndex);
    const clones = cloneIds.map((cloneId) => {
      const clone = this.clonesState.ownedClones.getCloneById(cloneId);

      if (!clone) {
        throw new Error(`Clone with id ${cloneId} not found`);
      }

      return clone;
    });

    return this.activityState.sidejobActivityValidator.validateSidejobsBatch(sidejobName, district, clones) === SidejobsBatchValidationResult.valid;
  }
}
