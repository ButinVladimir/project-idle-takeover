import { ISerializedSidejob, ISidejob, SidejobValidationResult } from '@state/activity-state';
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

  makeSidejob(args: ISerializedSidejob): ISidejob {
    return this.activityState.sidejobsFactory.makeSidejob(args);
  }

  getExistingSidejobByClone(cloneId?: string): ISidejob | undefined {
    if (!cloneId) {
      return undefined;
    }

    return this.activityState.sidejobsActivity.getActivityByCloneId(cloneId)?.sidejob;
  }

  assignClone(args: ISerializedSidejob) {
    this.activityState.sidejobsActivity.assignSidejob(args);
  }

  validateSidejob(sidejob: ISidejob): boolean {
    return this.activityState.sidejobActivityValidator.validateSidejob(sidejob) === SidejobValidationResult.valid;
  }
}
