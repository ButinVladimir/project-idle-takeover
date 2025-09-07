import { ISerializeable } from '@shared/index';
import { Faction } from '@shared/types';
import { IFactionSerializedState } from './factions-serialized-state';
import { IFactionValues } from './faction-values';

export interface IFactionState extends ISerializeable<IFactionSerializedState> {
  currentFaction: Faction;
  currentFactionValues: IFactionValues;
  getFactionValues(faction: Faction): IFactionValues;
  getFactionLoanTier(faction: Faction): number;
}
