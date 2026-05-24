import { ContractsBatchValidationResult } from '@state/activity-state';
import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IContractAssignment } from '@state/automation-state';

export class AssignClonesContractDialogController extends BaseController {
  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  listAvailableContracts(): string[] {
    return this.unlockState.activities.contracts.listAvailableActivities();
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getExistingContractAssignmentsByDistrictsAndContractNames(
    contractNames: string[],
    districtIndexes: number[],
  ): IContractAssignment[] {
    const foundContractAssignments = [];

    for (const contractName of contractNames) {
      for (const districtIndex of districtIndexes) {
        const contractAssignment = this.automationState.contracts.getContractAssignmentByDistrictAndContract(
          districtIndex,
          contractName,
        );

        if (contractAssignment) {
          foundContractAssignments.push(contractAssignment);
        }
      }
    }

    return foundContractAssignments;
  }

  assignClones(contractNames: string[], districtIndexes: number[], cloneIds: string[]): boolean {
    const districts = districtIndexes.map((districtIndex) => this.cityState.getDistrictState(districtIndex));
    const clones = cloneIds.map((cloneId) => this.clonesState.ownedClones.getCloneById(cloneId)!);

    return this.automationState.contracts.addContractAssignments(contractNames, districts, clones);
  }

  validateContractsBatch(
    contractNames: string[],
    districtIndexes: number[],
    cloneIds: string[],
  ): ContractsBatchValidationResult {
    const districts = districtIndexes.map((districtIndex) => this.cityState.getDistrictState(districtIndex));
    const clones = cloneIds.map((cloneId) => this.clonesState.ownedClones.getCloneById(cloneId)!);

    return this.activityState.contractActivityValidator.validateContractsBatch(contractNames, districts, clones);
  }
}
