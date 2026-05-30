import { IClone } from '@state/clones-state';
import { IDistrictState } from '@state/city-state';
import { BaseController } from '@shared/index';

export class PrimaryActivityListFilterController extends BaseController {
  listOwnedClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }
}
