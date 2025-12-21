import { FactionPlaystyle } from '@state/faction-state';
import { BaseController } from '@shared/index';

export class CityDistrictPageController extends BaseController {
  isContractsTabUnlocked(): boolean {
    return this.factionState.currentFactionValues.playstyle !== FactionPlaystyle.selectFaction;
  }

  getDistrictState(districtIndex: number) {
    return this.cityState.getDistrictState(districtIndex);
  }
}
