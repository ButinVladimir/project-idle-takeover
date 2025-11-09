import { BaseController } from '@shared/base-controller';

export class CityDistrictContractsPanelController extends BaseController {
  getAvailableContracts(): string[] {
    return this.unlockState.activities.contracts.listAvailableActivities();
  }
}
