import { BaseController } from '@shared/index';
import { IClone } from '@state/clones-state';
import { IDistrictState } from '@state/city-state';

export class SidejobsListFilterController extends BaseController {
  listAvailableSidejobs(): string[] {
    return this.unlockState.activities.sidejobs.listAvailableActivities();
  }

  listOwnedClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }
}
