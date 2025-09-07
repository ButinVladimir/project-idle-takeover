import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import programs from '@configs/programs.json';
import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';
import { Feature } from '@shared/index';
import { BaseAvailableCategoryItemsState } from './base-available-category-items-state';
import { PROGRAM_TEXTS } from '@texts/index';

@injectable()
export class AvailableProgramsState extends BaseAvailableCategoryItemsState<ProgramName> {
  makeUnlockNotificationMessage(itemName: ProgramName, formattedTier: string): string {
    return msg(str`Program "${PROGRAM_TEXTS[itemName].title()}" with tier ${formattedTier} has been unlocked.`);
  }

  protected getLoanedItemsFromFaction(): ProgramName[] {
    return this._factionState.currentFactionValues.loans.programs;
  }

  protected checkRequiredFeatures(itemName: ProgramName): boolean {
    const features = programs[itemName].requiredFeatures as Feature[];

    return features.every((feature) => this._unlockState.features.isFeatureUnlocked(feature));
  }
}
