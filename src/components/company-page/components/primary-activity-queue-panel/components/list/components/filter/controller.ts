import { IPrimaryActivity } from '@state/activity-state';
import { BaseController } from '@shared/index';

export class PrimaryActivityListFilterController extends BaseController {
  listPrimaryActivities(): IPrimaryActivity[] {
    return this.activityState.primaryActivityQueue.listActivities();
  }
}
