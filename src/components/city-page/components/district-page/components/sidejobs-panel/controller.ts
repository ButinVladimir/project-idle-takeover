import { BaseController } from '@shared/base-controller';

export class CityDistrictSidejobsPanelController extends BaseController {
  getAvailableSidejobs(): string[] {
    return this.unlockState.activities.sidejobs.listAvailableActivities();
  }
}
