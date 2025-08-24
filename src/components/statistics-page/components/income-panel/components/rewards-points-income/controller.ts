import { BaseController } from '@shared/base-controller';
import { IDistrictState } from '@state/city-state';

export class StatisticsRewardsPointsIncomeController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getPointsByDistrict(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.rewards.points;
  }

  getPointsByProgram() {
    return this.globalState.rewards.pointsByProgram;
  }
}
