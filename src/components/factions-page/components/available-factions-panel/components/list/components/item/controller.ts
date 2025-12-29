import { BaseController } from '@shared/index';

export class FactionsAvailableFactionsListItemController extends BaseController {
  joinFaction(faction: string) {
    this.factionState.joinFaction(faction);
  }
}
