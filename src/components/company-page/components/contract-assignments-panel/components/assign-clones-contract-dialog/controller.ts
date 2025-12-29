import { ContractValidationResult, IContract, ISerializedContract } from '@state/activity-state';
import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

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

  getContract(args: ISerializedContract): IContract {
    return this.activityState.contractsFactory.makeContract(args);
  }

  getExistingContractByDistrictAndContract(districtIndex: number, contractName: string): IContract | undefined {
    return this.automationState.contracts.getContractAssignmentByDistrictAndContract(districtIndex, contractName)
      ?.contract;
  }

  assignClones(args: ISerializedContract) {
    this.automationState.contracts.addContractAssignment({
      contract: {
        assignedCloneIds: args.assignedCloneIds,
        contractName: args.contractName,
        districtIndex: args.districtIndex,
      },
    });
  }

  validateContract(contract: IContract): ContractValidationResult {
    return this.activityState.contractActivityValidator.validate(contract);
  }
}
