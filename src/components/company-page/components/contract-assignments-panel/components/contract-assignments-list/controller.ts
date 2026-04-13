import { BaseController } from '@shared/index';
import { IContractAssignment } from '@state/automation-state';
import { IPrimaryActivity } from '@state/activity-state';

export class ContractAssignmentsListController extends BaseController {
  getContractActivity(contractAssignment: IContractAssignment): IPrimaryActivity | undefined {
    return this.activityState.primaryActivityQueue.getActivityByAssignmentId(contractAssignment.id);
  }

  listContractAssignments(): IContractAssignment[] {
    return this.automationState.contracts.listContractAssignments();
  }

  moveContractAssignment(id: string, position: number) {
    this.automationState.contracts.moveContractAssignment(id, position);
    this.host.requestUpdate();
  }
}
