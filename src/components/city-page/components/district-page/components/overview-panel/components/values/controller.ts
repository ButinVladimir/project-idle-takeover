import { BaseController, Feature } from '@shared/index';

export class CityDistrictOverviewPanelValuesController extends BaseController {
  getDistrictState(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex);
  }

  isInfluenceUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.influence);
  }

  areFactionsUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.factions);
  }
}
