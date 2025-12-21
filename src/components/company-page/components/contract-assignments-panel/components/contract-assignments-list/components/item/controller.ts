import { IContractAssignment } from '@state/automation-state';
import { BaseController } from '@shared/index';

export class ContractAssignmentsListItemController extends BaseController {
  private _assignment?: IContractAssignment;

  checkCanBeStarted(contractAssignment: IContractAssignment): boolean {
    return this.automationState.contracts.starter.checkContractAssignment(contractAssignment);
  }

  startContractAssignment(contractAssignmentId: string): boolean {
    return this.automationState.contracts.starter.startAssignment(contractAssignmentId);
  }

  getContractAssignmentById(id: string): IContractAssignment | undefined {
    if (this._assignment?.id !== id) {
      this._assignment = this.automationState.contracts.getContractAssignmentById(id);
    }

    return this._assignment;
  }

  removeContractAssignmentById(id: string) {
    this.automationState.contracts.removeContractAssignmentById(id);
  }

  toggleContractAssignment(): void {
    this._assignment?.toggleEnabled(!this._assignment.enabled);
  }
}
