import { BaseController, Feature } from '@shared/index';

export class CityDistrictOverviewPanelValuesController extends BaseController {
  getDistrictState(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex);
  }

  isDistrictTiersUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.districtTiers);
  }
}
