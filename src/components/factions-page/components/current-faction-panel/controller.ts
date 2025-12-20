import { BaseController } from '@shared/index';

export class FactionsCurrentFactionPanelController extends BaseController {
  get currentFaction(): string {
    return this.factionState.currentFaction;
  }
}
