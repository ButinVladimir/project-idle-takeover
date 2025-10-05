import { BaseController } from '@shared/index';

export class OverviewUnlockedFeaturesController extends BaseController {
  listUnlockedFeatures(): Feature[] {
    return this.unlockState.features.listUnlockedFeatures();
  }
}
