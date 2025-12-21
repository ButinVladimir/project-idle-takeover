import { BaseController } from '@shared/index';

export class OverviewUnlockedCloneTemplatesController extends BaseController {
  listAllItems() {
    return this.unlockState.items.cloneTemplates.listAvailableItems();
  }

  listDesigns() {
    return this.unlockState.items.cloneTemplates.listDesigns();
  }

  listLoanedItems() {
    return this.unlockState.items.cloneTemplates.listLoanedItems();
  }

  getItemHighestAvailableTier(itemName: string) {
    return this.unlockState.items.cloneTemplates.getItemHighestAvailableTier(itemName);
  }

  getDesignTier(itemName: string) {
    return this.unlockState.items.cloneTemplates.getDesignTier(itemName);
  }

  getLoanedTier() {
    return this.factionState.getFactionLoanTier(this.factionState.currentFaction);
  }
}
