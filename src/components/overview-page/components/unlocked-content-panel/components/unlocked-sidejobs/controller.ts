import { SidejobName } from '@state/company-state';
import { BaseController } from '@shared/index';

export class OverviewUnlockedSidejobsController extends BaseController {
  listUnlockedSidejobs(): SidejobName[] {
    return this.unlockState.activities.sidejobs.listUnlockedSidejobs();
  }
}
