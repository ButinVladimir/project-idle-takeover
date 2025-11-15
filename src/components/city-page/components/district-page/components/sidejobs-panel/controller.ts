import { BaseController } from '@shared/index';

export class CityDistrictSidejobsPanelController extends BaseController {
  getAvailableSidejobs(): string[] {
    return this.unlockState.activities.sidejobs.listAvailableActivities();
  }
}
