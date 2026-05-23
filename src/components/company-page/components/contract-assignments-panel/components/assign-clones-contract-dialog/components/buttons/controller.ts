import { IContractAssignment } from '@state/automation-state';
import { BaseController } from '@shared/index';
import { ContractsBatchValidationResult } from '@state/activity-state';

export class AssignClonesContractDialogButtonsController extends BaseController {
  getExistingContractAssignmentsByDistrictsAndContractNames(contractNames: string[], districtIndexes: number[]): IContractAssignment[] {
    const foundContractAssignments = [];

    for (const contractName of contractNames) {
      for (const districtIndex of districtIndexes) {
        const contractAssignment = this.automationState.contracts.getContractAssignmentByDistrictAndContract(districtIndex, contractName);

        if (contractAssignment) {
          foundContractAssignments.push(contractAssignment);
        }
      }
    }

    return foundContractAssignments;
  }

  validateContractsBatch(contractNames: string[], districtIndexes: number[], cloneIds: string[]): ContractsBatchValidationResult {
    const districts = districtIndexes.map((districtIndex) => this.cityState.getDistrictState(districtIndex));
    const clones = cloneIds.map((cloneId) => this.clonesState.ownedClones.getCloneById(cloneId)!);

    return this.activityState.contractActivityValidator.validateContractsBatch(contractNames, districts, clones);
  }
}
