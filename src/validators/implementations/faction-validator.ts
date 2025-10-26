import { injectable } from 'inversify';
import { styleText } from 'node:util';
import factions from '@configs/factions.json';
import programs from '@configs/programs.json';
import cloneTemplates from '@configs/clone-templates.json';
import { FACTION_TEXTS } from '@texts/index';
import { Faction } from '@shared/index';
import { IFactionValues } from '@state/faction-state';
import { ICloneTemplate } from '@state/company-state';
import { IFactionValidator } from '../interfaces';

@injectable()
export class FactionValidator implements IFactionValidator {
  validate(name: Faction) {
    console.log(`\tValidating faction ${styleText('cyanBright', name)}`);

    this.validateTitle(name);
    this.validateOverview(name);
    this.validateItems(name, false);
    this.validateItems(name, true);
  }

  private validateTitle(name: Faction) {
    if (!FACTION_TEXTS[name]?.title) {
      this.printMissingProperty(name, 'title');
    }
  }

  private validateOverview(name: Faction) {
    if (!FACTION_TEXTS[name]?.overview) {
      this.printMissingProperty(name, 'overview');
    }
  }

  private validateItems(name: Faction, special: boolean) {
    this.validatePrograms(name, special);
    this.validateCloneTemplates(name, special);
  }

  private validatePrograms(name: Faction, special: boolean) {
    this.getItems(name, special)
      .programs.filter((program) => !programs[program])
      .forEach((program) => {
        this.printUnimplementedItem(name, special, 'program', program);
      });
  }

  private validateCloneTemplates(name: Faction, special: boolean) {
    const allCloneTemplates = cloneTemplates as any as Record<string, ICloneTemplate>;

    this.getItems(name, special)
      .cloneTemplates.filter((cloneTemplate) => !allCloneTemplates[cloneTemplate])
      .forEach((cloneTemplate) => {
        this.printUnimplementedItem(name, special, 'clone template', cloneTemplate);
      });
  }

  private getItems(name: Faction, special: boolean) {
    const faction = (factions as any as Record<string, IFactionValues>)[name];

    return special ? faction.special : faction.loans;
  }

  private printMissingProperty(name: string, property: string) {
    console.log(`\t\tFaction ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')} ${property}`);
  }

  private printUnimplementedItem(faction: Faction, special: boolean, itemType: string, item: string) {
    const specialText = special ? 'special' : 'loaned';

    console.log(
      `Faction ${styleText('cyanBright', faction)} ${specialText} ${itemType} ${item} is ${styleText('redBright', 'incorrect')}`,
    );
  }
}
