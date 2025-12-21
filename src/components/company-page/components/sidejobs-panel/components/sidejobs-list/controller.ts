import { ISidejobActivity } from '@state/activity-state';
import { BaseController } from '@shared/index';

export class SidejobsListController extends BaseController {
  listActivities(): ISidejobActivity[] {
    return this.activityState.sidejobsActivity.listActivities();
  }

  cancelAllActivities(): void {
    this.activityState.sidejobsActivity.cancelAllActivities();
  }

  toggleAllActivities(enabled: boolean) {
    this.activityState.sidejobsActivity.toggleAllActivities(enabled);
  }
}
