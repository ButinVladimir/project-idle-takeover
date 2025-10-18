import { Faction } from '@shared/index';

export interface IFactionValidator {
  validateTitle(name: Faction): boolean;
  validateOverview(name: Faction): boolean;
  validatePrograms(name: Faction, special: boolean): string[];
  validateCloneTemplates(name: Faction, special: boolean): string[];
}
