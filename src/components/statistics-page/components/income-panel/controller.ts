import { Feature } from '@shared/types';
import { BaseController } from '@shared/base-controller';

export class StatisticsIncomePanelController extends BaseController {
  isFeatureUnlocked(feature: Feature) {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
