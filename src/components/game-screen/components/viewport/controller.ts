import { BaseController } from '@shared/base-controller';
import { Feature } from '@shared/types';

export class ViewportController extends BaseController {
  isFeatureUnlocked(feature: Feature): boolean {
    return this.unlockState.features.isFeatureUnlocked(feature);
  }
}
