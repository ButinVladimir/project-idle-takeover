import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class StatisticsRewardsController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getProgramRewards(): number {
    return this.globalState.rewards.multiplierByProgram;
  }

  getDistrictRewards(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.rewards.totalMultiplier;
  }
}
