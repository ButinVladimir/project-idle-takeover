import { BaseController } from '@shared/index';
import { IContractAssignment } from '@state/automation-state';

export class ContractAssignmentsListController extends BaseController {
  listContractAssignments(): IContractAssignment[] {
    return this.automationState.contracts.listContractAssignments();
  }

  removeAllContractAssignments(): void {
    this.automationState.contracts.removeAllContractAssignments();
  }

  moveContractAssignment(id: string, position: number) {
    this.automationState.contracts.moveContractAssignment(id, position);
    this.host.requestUpdate();
  }

  toggleAllContractAssignments(active: boolean) {
    this.automationState.contracts.toggleAllContractAssignments(active);
  }
}
