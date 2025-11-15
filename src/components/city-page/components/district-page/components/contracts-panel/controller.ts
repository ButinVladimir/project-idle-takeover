import { BaseController } from '@shared/index';

export class CityDistrictContractsPanelController extends BaseController {
  getAvailableContracts(): string[] {
    return this.unlockState.activities.contracts.listAvailableActivities();
  }
}
