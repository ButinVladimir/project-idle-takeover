import { injectable } from 'inversify';
import { CloneTemplateName } from '@state/company-state';
import { Feature } from '@shared/types';
import { BaseAvailableCategoryItemsState } from './base-available-category-items-state';

@injectable()
export class AvailableCloneTemplatesState extends BaseAvailableCategoryItemsState<CloneTemplateName> {
  protected getLoanedItemsFromFaction(): CloneTemplateName[] {
    return this._factionState.currentFactionValues.loans.cloneTemplates;
  }

  protected checkRequiredFeatures(): boolean {
    return this._unlockState.features.isFeatureUnlocked(Feature.companyManagement);
  }
}
