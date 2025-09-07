import { BaseController } from '@shared/base-controller';

export class OverviewUnlockedFeaturesProgressController extends BaseController {
  getUnlockedFeaturesCount() {
    return this.unlockState.features.listUnlockedFeatures().length;
  }
}
