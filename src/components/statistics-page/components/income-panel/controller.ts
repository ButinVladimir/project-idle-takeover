import { BaseController, Feature } from '@shared/index';

export class StatisticsIncomePanelController extends BaseController {
  isFeatureUnlocked(feature: Feature) {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
