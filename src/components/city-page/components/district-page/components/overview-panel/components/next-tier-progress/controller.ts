import { BaseController } from '@shared/base-controller';

export class CityDistrictOverviewPanelNextTierProgressController extends BaseController {
  getDistrictInfluencePoints(districtIndex: number): number {
    return this.getDistrictInfluenceParameter(districtIndex).points;
  }

  getCurrentTierRequirements(districtIndex: number): number {
    const tierParameter = this.getDistrictInfluenceParameter(districtIndex);
    return tierParameter.getTierRequirements(tierParameter.tier - 1);
  }

  getNextTierRequirements(districtIndex: number): number {
    const tierParameter = this.getDistrictInfluenceParameter(districtIndex);
    return tierParameter.getTierRequirements(tierParameter.tier);
  }

  getDistrictInfluenceGrowth(districtIndex: number): number {
    return this.growthState.influence.getGrowthByDistrict(districtIndex);
  }

  private getDistrictInfluenceParameter(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex).parameters.influence;
  }
}
