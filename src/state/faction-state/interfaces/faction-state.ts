import { ISerializeable } from '@shared/index';
import { Faction } from '@shared/types';
import { IFactionSerializedState } from './factions-serialized-state';
import { IFactionValues } from './faction-values';

export interface IFactionState extends ISerializeable<IFactionSerializedState> {
  joiningFactionAvailable: boolean;
  currentFaction: Faction;
  currentFactionValues: IFactionValues;
  getFactionValues(faction: Faction): IFactionValues;
  getFactionLoanTier(faction: Faction): number;
  listAvailableFactions(): Faction[];
  getFactionByIndex(index: number): Faction;
  makeJoiningFactionAvailable(): void;
  joinFaction(faction: Faction): boolean;
}
