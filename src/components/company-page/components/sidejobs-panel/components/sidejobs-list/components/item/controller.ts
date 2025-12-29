import { BaseController } from '@shared/index';
import { ISidejobActivity } from '@state/activity-state';

export class SidejobsListItemController extends BaseController {
  private _activity?: ISidejobActivity;

  getActivityById(id: string): ISidejobActivity | undefined {
    if (this._activity?.id !== id) {
      this._activity = this.activityState.sidejobsActivity.getActivityById(id);
    }

    return this._activity;
  }

  cancelActivityById(id: string) {
    this.activityState.sidejobsActivity.cancelActivity(id);
  }

  toggleSidejob(): void {
    this._activity?.toggleEnabled(!this._activity.enabled);
  }
}
