import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';
import { PROGRAM_TEXTS } from '@texts/index';
import { typedPrograms } from '@state/mainframe-state';
import { BaseAvailableCategoryItemsState } from './base-available-category-items-state';

@injectable()
export class AvailableProgramsState extends BaseAvailableCategoryItemsState<ProgramName> {
  makeUnlockNotificationMessage(itemName: ProgramName, formattedTier: string): string {
    return msg(str`Program "${PROGRAM_TEXTS[itemName].title()}" with tier ${formattedTier} has been unlocked.`);
  }

  protected getLoanedItemsFromFaction(): ProgramName[] {
    return this._factionState.currentFactionValues.loanedItems.programs;
  }

  protected checkRequiredMilestones(itemName: ProgramName): boolean {
    const milestones = typedPrograms[itemName].requiredMilestones;

    return milestones.every((milestones) => this._unlockState.milestones.isMilestoneReached(milestones));
  }
}
