import { BaseController } from '@shared/index';

export class CityDistrictSidejobsListItemUnlockProgressController extends BaseController {
  getPassedTime(contractName: string, districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).counters.contracts.getPassedGenerationTime(contractName);
  }

  getRequiredTime(contractName: string, districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).counters.contracts.getRequiredGenerationTime(contractName);
  }

  getChance(contractName: string, districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).counters.contracts.getChance(contractName);
  }
}
