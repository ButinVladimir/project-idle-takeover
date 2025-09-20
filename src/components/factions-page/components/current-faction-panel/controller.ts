import { BaseController, Faction } from '@shared/index';

export class FactionsCurrentFactionPanelController extends BaseController {
  get currentFaction(): Faction {
    return this.factionState.currentFaction;
  }
}
