import { BaseController } from '@shared/index';

export class CityDistrictPageController extends BaseController {
  isContractsTabUnlocked(): boolean {
    return this.factionState.currentFactionValues.playstyle !== 'selectFaction';
  }

  getDistrictState(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex);
  }
}
