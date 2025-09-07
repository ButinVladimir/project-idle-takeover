import { Feature } from '@shared/types';
import { BaseController } from '@shared/base-controller';

export class MainframePageController extends BaseController {
  isMainframeHardwareUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.mainframeHardware);
  }

  isMainframeProgramsUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.mainframePrograms);
  }
}
