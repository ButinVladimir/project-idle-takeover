import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class StatisticsConnectivityController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getDistrictConnectivity(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }
}
