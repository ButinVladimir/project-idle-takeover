import { BaseController } from '@shared/index';
import { IClone } from '@state/clones-state';
import { IDistrictState } from '@state/city-state';

export class ContractAssigmentsListFilterController extends BaseController {
  listAvailableContracts(): string[] {
    return this.unlockState.activities.contracts.listAvailableActivities();
  }

  listOwnedClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }
}
