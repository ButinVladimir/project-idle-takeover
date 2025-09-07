import { BaseController } from '@shared/index';
import { CloneTemplateName } from '@state/company-state';

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

  getItemHighestAvailableTier(itemName: CloneTemplateName) {
    return this.unlockState.items.cloneTemplates.getItemHighestAvailableTier(itemName);
  }

  getDesignTier(itemName: CloneTemplateName) {
    return this.unlockState.items.cloneTemplates.getDesignTier(itemName);
  }

  getLoanedTier() {
    return this.factionState.getFactionLoanTier(this.factionState.currentFaction);
  }
}
