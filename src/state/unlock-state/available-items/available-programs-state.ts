import { injectable } from 'inversify';
import programs from '@configs/programs.json';
import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';
import { Feature } from '@shared/types';
import { BaseAvailableCategoryItemsState } from './base-available-category-items-state';

@injectable()
export class AvailableProgramsState extends BaseAvailableCategoryItemsState<ProgramName> {
  protected getLoanedItemsFromFaction(): ProgramName[] {
    return this._factionState.currentFactionValues.loans.programs;
  }

  protected checkRequiredFeatures(itemName: ProgramName): boolean {
    const features = programs[itemName].requiredFeatures as Feature[];

    return features.every((feature) => this._unlockState.features.isFeatureUnlocked(feature));
  }
}
