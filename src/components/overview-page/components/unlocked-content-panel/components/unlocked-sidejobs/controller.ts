import { BaseController } from '@shared/index';

export class OverviewUnlockedSidejobsController extends BaseController {
  listUnlockedSidejobs(): string[] {
    return this.unlockState.activities.sidejobs.listUnlockedActivities();
  }
}
