import { IPrimaryActivity } from '@/state/activity-state';
import { BaseController } from '@shared/index';
import { IContractAssignment } from '@state/automation-state';

export class ContractAssignmentsListItemStatusController extends BaseController {
  getContractActivity(contractAssignment: IContractAssignment): IPrimaryActivity | undefined {
    return this.activityState.primaryActivityQueue.getActivityByAssignmentId(contractAssignment.id);
  }

  validateContractAssignment(contractAssignment: IContractAssignment) {
    return this.activityState.contractActivityValidator.validate(contractAssignment.contract);
  }

  getAvailableCounters(contractAssignment: IContractAssignment): number {
    return contractAssignment.contract.district.counters.contracts.getAvailableAmount(
      contractAssignment.contract.contractName,
    );
  }
}
