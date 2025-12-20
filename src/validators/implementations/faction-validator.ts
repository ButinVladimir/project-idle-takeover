import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { FACTION_TEXTS } from '@texts/index';
import { typedFactions } from '@state/faction-state';
import { typedCloneTemplates } from '@state/clones-state';
import { typedContracts } from '@state/activity-state';
import { typedPrograms } from '@state/mainframe-state';
import { IFactionValidator } from '../interfaces';

@injectable()
export class FactionValidator implements IFactionValidator {
  validate(name: string) {
    console.log(`\tValidating faction ${styleText('cyanBright', name)}`);

    this.validateTitle(name);
    this.validateOverview(name);
    this.validateItems(name, false);
    this.validateItems(name, true);
    this.validateActivity(name);
  }

  private validateTitle(name: string) {
    if (!FACTION_TEXTS[name]?.title) {
      this.printMissingProperty(name, 'title');
    }
  }

  private validateOverview(name: string) {
    if (!FACTION_TEXTS[name]?.overview) {
      this.printMissingProperty(name, 'overview');
    }
  }

  private validateItems(name: string, special: boolean) {
    this.validatePrograms(name, special);
    this.validateCloneTemplates(name, special);
  }

  private validatePrograms(name: string, special: boolean) {
    this.getItems(name, special)
      .programs.filter((program) => !typedPrograms[program])
      .forEach((program) => {
        this.printUnimplementedItem(name, special, 'program', program);
      });
  }

  private validateCloneTemplates(name: string, special: boolean) {
    this.getItems(name, special)
      .cloneTemplates.filter((cloneTemplate) => !typedCloneTemplates[cloneTemplate])
      .forEach((cloneTemplate) => {
        this.printUnimplementedItem(name, special, 'clone template', cloneTemplate);
      });
  }

  private getItems(name: string, special: boolean) {
    const faction = typedFactions[name];

    return special ? faction.specialItems : faction.loanedItems;
  }

  private validateActivity(name: string) {
    this.validateContracts(name);
  }

  private validateContracts(name: string) {
    typedFactions[name].activities.contracts
      .filter((contract) => !typedContracts[contract])
      .forEach((contract) => {
        console.log(
          `Faction ${styleText('cyanBright', name)} contract ${contract} is ${styleText('redBright', 'incorrect')}`,
        );
      });
  }

  private printMissingProperty(name: string, property: string) {
    console.log(`\t\tFaction ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')} ${property}`);
  }

  private printUnimplementedItem(faction: string, special: boolean, itemType: string, item: string) {
    const specialText = special ? 'special' : 'loaned';

    console.log(
      `Faction ${styleText('cyanBright', faction)} ${specialText} ${itemType} ${item} is ${styleText('redBright', 'incorrect')}`,
    );
  }
}
