import { BaseController } from '@shared/index';

export class OverviewUnlockedFeaturesProgressController extends BaseController {
  getUnlockedFeaturesCount() {
    return this.unlockState.features.listUnlockedFeatures().length;
  }
}
