import { ISidejobActivity } from '@state/activity-state';
import { BaseController } from '@shared/index';

export class SidejobsListFilterController extends BaseController {
  listSidejobs(): ISidejobActivity[] {
    return this.activityState.sidejobsActivity.listActivities();
  }
}
