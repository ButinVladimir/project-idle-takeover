import { BaseController } from '@shared/base-controller';
import { Feature } from '@shared/types';

export class OverviewUnlockedItemsPanelController extends BaseController {
  areProgramsUnlocked() {
    return this.unlockState.features.isFeatureUnlocked(Feature.mainframePrograms);
  }

  areCloneTemplatesUnlocked() {
    return this.unlockState.features.isFeatureUnlocked(Feature.companyManagement);
  }
}
