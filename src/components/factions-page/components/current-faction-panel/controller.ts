import { IFactionValues } from '@/state/faction-state';
import { BaseController } from '@shared/index';

export class FactionsCurrentFactionPanelController extends BaseController {
  get currentFaction(): string {
    return this.factionState.currentFaction;
  }

  get currentFactionValues(): IFactionValues {
    return this.factionState.currentFactionValues;
  }
}
