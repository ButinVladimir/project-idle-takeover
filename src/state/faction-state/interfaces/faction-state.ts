import { ISerializeable } from '@shared/index';
import { IFactionSerializedState } from './factions-serialized-state';
import { IFactionValues } from './faction-values';

export interface IFactionState extends ISerializeable<IFactionSerializedState> {
  joiningFactionAvailable: boolean;
  currentFaction: string;
  currentFactionValues: IFactionValues;
  getFactionValues(faction: string): IFactionValues;
  getFactionLoanTier(faction: string): number;
  listAvailableFactions(): string[];
  getFactionByIndex(index: number): string;
  makeJoiningFactionAvailable(): void;
  joinFaction(faction: string): boolean;
}
