import { BaseController } from '@shared/index';

export class FactionsAvailableFactionsListController extends BaseController {
  listAvailableFactions(): string[] {
    return this.factionState.listAvailableFactions();
  }

  isJoiningFactionAvailable(): boolean {
    return this.factionState.joiningFactionAvailable;
  }
}
