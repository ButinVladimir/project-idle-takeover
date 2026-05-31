import { ContractValidationResult, IContract, ISerializedContract } from '@state/activity-state';
import { IContractAssignment } from '@state/automation-state';
import { BaseController } from '@shared/index';

export class AssignClonesContractDialogBatchItemController extends BaseController {
  getExistingContractAssignment(contractName: string, districtIndex: number): IContractAssignment | undefined {
    return this.automationState.contracts.getContractAssignmentByDistrictAndContract(districtIndex, contractName);
  }

  validateContract(contractName: string, districtIndex: number, cloneIds: string[]): ContractValidationResult {
    const district = this.cityState.getDistrictState(districtIndex);
    const clones = cloneIds.map((cloneId) => this.clonesState.ownedClones.getCloneById(cloneId)!);

    return this.activityState.contractActivityValidator.validateContract(contractName, district, clones);
  }

  makeContract(args: ISerializedContract): IContract {
    return this.activityState.contractsFactory.makeContract(args);
  }
}
