import { injectable } from 'inversify';
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
  validateTitle(name: Faction): boolean {
    return !!FACTION_TEXTS[name]?.title;
  }

  validateOverview(name: Faction): boolean {
    return !!FACTION_TEXTS[name]?.overview;
  }

  validatePrograms(name: Faction, special: boolean): string[] {
    const missedPrograms = this.getItems(name, special).programs.filter((program) => !programs[program]);

    return missedPrograms;
  }

  validateCloneTemplates(name: Faction, special: boolean): string[] {
    const allCloneTemplates = cloneTemplates as any as Record<string, ICloneTemplate>;
    const missedCloneTemplates = this.getItems(name, special).cloneTemplates.filter(
      (cloneTemplate) => !allCloneTemplates[cloneTemplate],
    );

    return missedCloneTemplates;
  }

  private getItems(name: Faction, special: boolean) {
    const faction = (factions as any as Record<string, IFactionValues>)[name];

    return special ? faction.special : faction.loans;
  }
}
