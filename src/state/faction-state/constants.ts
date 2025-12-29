import factions from '@configs/factions.json';
import { typeConfigEntries } from '@shared/index';
import { IFactionValues } from './interfaces';

export const typedFactions = typeConfigEntries<IFactionValues>(factions);
