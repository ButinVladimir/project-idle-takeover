import { BaseController } from '@shared/index';

export class AssignCloneSidejobDialogDescriptionItemController extends BaseController {
  getAvailableCount(districtIndex: number, contractName: string): number {
    return this.cityState.getDistrictState(districtIndex).counters.contracts.getAvailableAmount(contractName);
  }

  getMinTeamSize(contractName: string): number {
    return this.activityState.contractActivityValidator.getMinTeamSize(contractName);
  }

  getMaxTeamSize(contractName: string): number {
    return this.activityState.contractActivityValidator.getMaxTeamSize(contractName);
  }
}
