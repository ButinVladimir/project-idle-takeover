import { BaseController } from '@shared/index';

export class PrimaryActivityListButtonsController extends BaseController {
  cancelActivities(ids: string[]): void {
    this.activityState.primaryActivityQueue.cancelActivitiesByIds(ids);
  }
}
