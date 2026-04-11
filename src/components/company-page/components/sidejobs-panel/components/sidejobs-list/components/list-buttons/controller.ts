import { BaseController } from '@shared/index';

export class SidejobsListButtonsController extends BaseController {
  cancelActivities(sidejobsIds: string[]): void {
    this.activityState.sidejobsActivity.cancelActivities(sidejobsIds);
  }
}
