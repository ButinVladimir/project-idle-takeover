import { BaseController, Feature } from '@shared/index';

export class CityDistrictOverviewPanelController extends BaseController {
  isInfluenceUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.influence);
  }
}
