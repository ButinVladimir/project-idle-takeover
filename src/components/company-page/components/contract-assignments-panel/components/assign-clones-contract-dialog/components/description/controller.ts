import { BaseController } from '@shared/index';

export class AssignCloneSidejobDialogDescriptionController extends BaseController {
  getAvailableCount(districtIndex: number, contractName: string): number {
    return this.cityState.getDistrictState(districtIndex).counters.contracts.getAvailableAmount(contractName);
  }
}
