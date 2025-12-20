import { BaseController } from '@shared/index';

export class FactionsPageController extends BaseController {
  isFactionSelected(): boolean {
    return this.factionState.currentFactionValues.playstyle !== 'selectFaction';
  }
}
