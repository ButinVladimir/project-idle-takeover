import { BaseController, Faction } from '@shared/index';

export class FactionsPageController extends BaseController {
  isFactionSelected(): boolean {
    return this.factionState.currentFaction !== Faction.neutral;
  }
}
