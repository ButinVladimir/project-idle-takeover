import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class StatisticsInfluencePointsIncomeController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getPointsByDistrict(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.influence.points;
  }
}
