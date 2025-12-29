import { IPrimaryActivity } from '@state/activity-state';
import { BaseController } from '@shared/index';

export class PrimaryActivityQueueListController extends BaseController {
  listActivities(): IPrimaryActivity[] {
    return this.activityState.primaryActivityQueue.listActivities();
  }

  cancelAllActivities(): void {
    this.activityState.primaryActivityQueue.cancelAllActivities();
  }
}
