import { BaseController } from '@shared/index';

export class OverviewReachedMilestonesProgressController extends BaseController {
  getReachedMilestonesCount() {
    return this.unlockState.milestones.listReachedMilestones().length;
  }
}
