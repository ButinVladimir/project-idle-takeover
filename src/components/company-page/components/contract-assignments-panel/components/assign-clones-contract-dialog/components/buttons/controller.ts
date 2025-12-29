import { BaseController } from '@shared/index';
import { ContractValidationResult, IContract } from '@state/activity-state';

export class AssignClonesContractDialogButtonsController extends BaseController {
  validateContract(contract: IContract): ContractValidationResult {
    return this.activityState.contractActivityValidator.validate(contract);
  }
}
