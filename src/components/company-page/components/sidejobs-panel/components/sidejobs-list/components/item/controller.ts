import { BaseController } from '@shared/index';
import { ISidejob } from '@state/activity-state';

export class SidejobsListItemController extends BaseController {
  private _sidejob?: ISidejob;

  getSidejobById(id: string): ISidejob | undefined {
    if (this._sidejob?.id !== id) {
      this._sidejob = this.activityState.sidejobs.getSidejobById(id);
    }

    return this._sidejob;
  }

  cancelSidejobById(id: string) {
    this.activityState.sidejobs.cancelSidejob(id);
  }
}
