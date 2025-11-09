import { BaseController } from '@shared/base-controller';

export class CityDistrictPageController extends BaseController {
  isContractsTabUnlocked(): boolean {
    return this.factionState.currentFaction !== 'neutral';
  }

  getDistrictState(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex);
  }
}
