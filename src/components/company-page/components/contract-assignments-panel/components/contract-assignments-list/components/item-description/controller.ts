import { BaseController, Milestone } from '@shared/index';

export class ContractsAssignmentsListItemDescriptionController extends BaseController {
  isMilestoneUnlocked(milestone: Milestone) {
    return this.unlockState.milestones.isMilestoneReached(milestone);
  }

  getAvailableCount(districtIndex: number, contractName: string): number {
    return this.cityState.getDistrictState(districtIndex).counters.contracts.getAvailableAmount(contractName);
  }
}
