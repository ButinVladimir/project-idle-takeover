import { BaseController, Faction } from '@shared/index';

export class FactionsAvailableFactionsListController extends BaseController {
  listAvailableFactions(): Faction[] {
    return this.factionState.listAvailableFactions();
  }

  isJoiningFactionAvailable(): boolean {
    return this.factionState.joiningFactionAvailable;
  }
}
