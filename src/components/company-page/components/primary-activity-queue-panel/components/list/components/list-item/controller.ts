import { BaseController } from '@shared/index';
import { IPrimaryActivity } from '@state/activity-state';

export class PrimaryActivityQueueListItemController extends BaseController {
  getPrimaryActivityById(id: string): IPrimaryActivity | undefined {
    return this.activityState.primaryActivityQueue.getActivityById(id);
  }

  cancelPrimaryActivityById(id: string) {
    this.activityState.primaryActivityQueue.cancelActivityById(id);
  }
}
