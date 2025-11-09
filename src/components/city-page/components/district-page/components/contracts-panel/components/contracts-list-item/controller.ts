import { BaseController } from '@shared/index';

export class CityDistrictContractsListItemController extends BaseController {
  getAvailableContractAmount(contractName: string, districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).contracts.counters.getAvailableAmount(contractName);
  }
}
