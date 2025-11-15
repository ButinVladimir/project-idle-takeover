import { BaseController, Feature } from '@shared/index';

export class AutomationAutobuyersPanelController extends BaseController {
  isFeatureUnlocked(feature: Feature): boolean {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
