import { ISidejobActivity } from '@state/activity-state';
import { BaseController } from '@shared/index';

export class SidejobsListItemStatusController extends BaseController {
  validateSidejob(sidejobActivity: ISidejobActivity) {
    return this.activityState.sidejobActivityValidator.validate(sidejobActivity.sidejob);
  }
}
