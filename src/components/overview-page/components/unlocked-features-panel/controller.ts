import { Feature } from '@shared/types';
import { BaseController } from '@shared/base-controller';

export class OverviewUnlockedFeaturesPanelController extends BaseController {
  listUnlockedFeatures(): Feature[] {
    return this.unlockState.features.listUnlockedFeatures();
  }
}
