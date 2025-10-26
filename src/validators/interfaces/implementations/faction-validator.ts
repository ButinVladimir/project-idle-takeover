import { Faction } from '@shared/index';

export interface IFactionValidator {
  validate(name: Faction): void;
}
