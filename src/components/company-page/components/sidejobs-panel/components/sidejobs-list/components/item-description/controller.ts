import { BaseController } from '@shared/base-controller';
import { Feature } from '@shared/index';

export class SidejobsListItemDescriptionController extends BaseController {
  isFeatureUnlocked(feature: Feature) {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
