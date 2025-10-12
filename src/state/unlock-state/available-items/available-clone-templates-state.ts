import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { Feature } from '@shared/index';
import { CLONE_TEMPLATE_TEXTS } from '@texts/index';
import { BaseAvailableCategoryItemsState } from './base-available-category-items-state';

@injectable()
export class AvailableCloneTemplatesState extends BaseAvailableCategoryItemsState<string> {
  makeUnlockNotificationMessage(itemName: string, formattedTier: string): string {
    return msg(
      str`Clone template "${CLONE_TEMPLATE_TEXTS[itemName].title()}" with tier ${formattedTier} has been unlocked.`,
    );
  }

  protected getLoanedItemsFromFaction(): string[] {
    return this._factionState.currentFactionValues.loans.cloneTemplates;
  }

  protected checkRequiredFeatures(): boolean {
    return this._unlockState.features.isFeatureUnlocked(Feature.companyManagement);
  }
}
