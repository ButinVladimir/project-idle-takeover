import { IContractAssignment } from '@state/automation-state';
import { BaseController } from '@shared/index';

export class ContractAssignmentsListItemController extends BaseController {
  private _assignment?: IContractAssignment;

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
    this._assignment?.toggleActive(!this._assignment.active);
  }
}
