import { BaseController } from '@shared/index';

export class CityDistrictSidejobsListItemUnlockProgressController extends BaseController {
  getPassedTime(contractName: string, districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).contracts.counters.getPassedGenerationTime(contractName);
  }

  getRequiredTime(contractName: string, districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).contracts.counters.getRequiredGenerationTime(contractName);
  }

  getChance(contractName: string, districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).contracts.counters.getChance(contractName);
  }
}
