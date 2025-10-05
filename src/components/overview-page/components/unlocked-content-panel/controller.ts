import { BaseController } from '@shared/base-controller';
import { Feature } from '@shared/types';

export class OverviewUnlockedContentPanelController extends BaseController {
  areProgramsUnlocked() {
    return this.unlockState.features.isFeatureUnlocked(Feature.mainframePrograms);
  }

  isCompanyUnlocked() {
    return this.unlockState.features.isFeatureUnlocked(Feature.companyManagement);
  }
}
