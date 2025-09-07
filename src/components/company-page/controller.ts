import { Feature } from '@shared/types';
import { BaseController } from '@shared/base-controller';

export class CompanyPageController extends BaseController {
  isCompanyManagementUnlocked(): boolean {
    return this.unlockState.features.isFeatureUnlocked(Feature.companyManagement);
  }
}
