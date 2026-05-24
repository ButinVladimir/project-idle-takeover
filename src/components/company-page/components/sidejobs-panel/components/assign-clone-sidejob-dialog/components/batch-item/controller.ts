import { ISidejob, SidejobValidationResult } from '@state/activity-state';
import { BaseController } from '@shared/index';

export class AssignCloneSidejobDialogBatchItemController extends BaseController {
  makeSidejob(sidejobName: string, districtIndex: number, assignedCloneId: string): ISidejob {
    return this.activityState.sidejobsFactory.makeSidejob({
      sidejobName,
      districtIndex,
      assignedCloneId,
    });
  }

  getExistingSidejobByClone(cloneId: string): ISidejob | undefined {
    return this.activityState.sidejobsActivity.getActivityByCloneId(cloneId)?.sidejob;
  }

  validateSidejob(sidejob: ISidejob): SidejobValidationResult {
    return this.activityState.sidejobActivityValidator.validateSidejob(
      sidejob.sidejobName,
      sidejob.district,
      sidejob.assignedClone,
    );
  }
}
