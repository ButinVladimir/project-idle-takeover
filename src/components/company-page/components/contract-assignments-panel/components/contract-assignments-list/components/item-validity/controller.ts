import { BaseController } from '@shared/index';
import { IContractAssignment } from '@state/automation-state';

export class ContractAssignmentsListItemValidityController extends BaseController {
  validateContractAssignment(contractAssignment: IContractAssignment) {
    return this.activityState.contractActivityValidator.validate(contractAssignment.contract);
  }
}
