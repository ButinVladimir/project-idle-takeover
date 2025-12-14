import { BaseController } from '@shared/index';
import { Feature } from '@shared/types';

export class OverviewUnlockedContentPanelController extends BaseController {
  isFeatureUnlocked(feature: Feature) {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }

  areProgramsUnlocked() {
    return this.unlockState.features.isFeatureUnlocked(Feature.mainframePrograms);
  }

  isCompanyUnlocked() {
    return this.unlockState.features.isFeatureUnlocked(Feature.companyManagement);
  }

  areContractsUnlocked() {
    return this.unlockState.features.isFeatureUnlocked(Feature.contracts);
  }
}
