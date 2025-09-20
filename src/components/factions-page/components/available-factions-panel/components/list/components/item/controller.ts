import { BaseController, Faction } from '@shared/index';

export class FactionsAvailableFactionsListItemController extends BaseController {
  joinFaction(faction: Faction) {
    this.factionState.joinFaction(faction);
  }
}
