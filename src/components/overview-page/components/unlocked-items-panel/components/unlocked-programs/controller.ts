import { BaseController } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export class OverviewUnlockedProgramsController extends BaseController {
  listAllItems() {
    return this.unlockState.items.programs.listAvailableItems();
  }

  listDesigns() {
    return this.unlockState.items.programs.listDesigns();
  }

  listLoanedItems() {
    return this.unlockState.items.programs.listLoanedItems();
  }

  getItemHighestAvailableTier(itemName: ProgramName) {
    return this.unlockState.items.programs.getItemHighestAvailableTier(itemName);
  }

  getDesignTier(itemName: ProgramName) {
    return this.unlockState.items.programs.getDesignTier(itemName);
  }

  getLoanedTier() {
    return this.factionState.getFactionLoanTier(this.factionState.currentFaction);
  }
}
