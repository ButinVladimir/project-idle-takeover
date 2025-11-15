import { ISidejob } from '@state/activity-state';
import { BaseController } from '@shared/index';

export class SidejobsListController extends BaseController {
  listSidejobs(): ISidejob[] {
    return this.activityState.sidejobs.listSidejobs();
  }

  cancelAllSidejobs(): void {
    this.activityState.sidejobs.cancelAllSidejobs();
  }
}
