import { FactionPlaystyle } from '@state/faction-state';
import { BaseController } from '@shared/index';

export class FactionsPageController extends BaseController {
  isFactionSelected(): boolean {
    return this.factionState.currentFactionValues.playstyle !== FactionPlaystyle.selectFaction;
  }
}
