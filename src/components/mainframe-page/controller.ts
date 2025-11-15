import { BaseController, Feature } from '@shared/index';

export class MainframePageController extends BaseController {
  isMainframeHardwareUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.mainframeHardware);
  }

  isMainframeProgramsUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.mainframePrograms);
  }
}
