import { IDistrictState } from '@state/city-state';
import { BaseController, MS_IN_SECOND, PointsMultiplierType } from '@shared/index';

export class StatisticsMultiplierPointsGrowthController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getGrowthByProgram(pointsMultiplierType: PointsMultiplierType) {
    return this.getMultiplierGrowthState(pointsMultiplierType).growthByProgram * MS_IN_SECOND;
  }

  getGrowthByDistrict(pointsMultiplierType: PointsMultiplierType, districtIndex: number) {
    return this.getMultiplierGrowthState(pointsMultiplierType).getGrowthByDistrict(districtIndex) * MS_IN_SECOND;
  }

  private getMultiplierGrowthState(pointsMultiplierType: PointsMultiplierType) {
    switch (pointsMultiplierType) {
      case 'computationalBase':
        return this.growthState.multipliers.computationalBase;
      case 'codeBase':
        return this.growthState.multipliers.codeBase;
    }
  }
}
