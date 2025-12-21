import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class StatisticsConnectivityPointsIncomeController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getPointsByDistrict(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.points;
  }

  getPointsByProgram() {
    return this.globalState.connectivity.pointsByProgram;
  }
}
