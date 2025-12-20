import { BaseController, Milestone } from '@shared/index';

export class OverviewReachedMilestonesController extends BaseController {
  listReachedMilestones(): Milestone[] {
    return this.unlockState.milestones.listReachedMilestones();
  }
}
