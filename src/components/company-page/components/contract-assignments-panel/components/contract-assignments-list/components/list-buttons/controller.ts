import { BaseController } from '@shared/index';
import { IContractAssignment } from '@state/automation-state';

export class SidejobsListButtonsController extends BaseController {
  checkContractAssignment(contractAssignment: IContractAssignment): boolean {
    return this.automationState.contracts.starter.checkContractAssignment(contractAssignment);
  }

  startContractAssignments(ids: string[]): boolean {
    return this.automationState.contracts.starter.startAssignments(ids);
  }

  removeContractAssignments(ids: string[]): void {
    this.automationState.contracts.removeContractAssignmentsByIds(ids);
  }
}
