import { BaseController, DistrictTypeRewardParameter } from '@shared/index';

export class CityDistrictOverviewPanelController extends BaseController {
  isInfluenceAvailable(): boolean {
    return this.unlockState.milestones.isRewardParameterUnlocked(DistrictTypeRewardParameter.influence);
  }
}
