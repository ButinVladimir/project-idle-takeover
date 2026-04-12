import { IContractAssignment } from '@state/automation-state';
import { BaseController } from '@shared/index';

export class ContractAssigmentsListFilterController extends BaseController {
  listContractAssignments(): IContractAssignment[] {
    return this.automationState.contracts.listContractAssignments();
  }
}
