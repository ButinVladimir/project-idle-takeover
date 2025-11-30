import { BaseController, Feature } from '@shared/index';

export class CompanyPageController extends BaseController {
  areContractsUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.contracts);
  }
}
