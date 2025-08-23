import { IDistrictMultipliers, IDistrictState } from '@state/city-state';
import { BaseController, PointsMultiplierType } from '@shared/index';

export class StatisticsMultiplierPointsIncomeController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getPointsByDistrict(multiplierType: PointsMultiplierType, districtIndex: number): number {
    const districtMultipliers = this.cityState.getDistrictState(districtIndex).parameters.multipliers;

    return this.getDistrictMultiplierParameter(districtMultipliers, multiplierType).points;
  }

  getPointsByProgram(pointsMultiplierType: PointsMultiplierType) {
    return this.getGlobalMultiplierState(pointsMultiplierType).pointsByProgram;
  }

  private getGlobalMultiplierState(pointsMultiplierType: PointsMultiplierType) {
    switch (pointsMultiplierType) {
      case 'computationalBase':
        return this.globalState.multipliers.computationalBase;
      case 'codeBase':
        return this.globalState.multipliers.codeBase;
    }
  }

  private getDistrictMultiplierParameter(
    districtMultipliers: IDistrictMultipliers,
    pointsMultiplierType: PointsMultiplierType,
  ) {
    switch (pointsMultiplierType) {
      case 'computationalBase':
        return districtMultipliers.computationalBase;
      case 'codeBase':
        return districtMultipliers.codeBase;
    }
  }
}
