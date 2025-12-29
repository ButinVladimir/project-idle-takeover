import { BaseController, Milestone } from '@shared/index';

export class AutomationAutobuyersPanelController extends BaseController {
  isMilestoneReached(milestone: Milestone): boolean {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }
}
