import { Faction } from '@shared/types';

export interface IFactionSerializedState {
  joiningFactionAvailable: boolean;
  currentFaction: Faction;
  factionsList: Faction[];
}
