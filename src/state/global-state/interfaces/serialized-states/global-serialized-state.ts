import { GameSpeed } from '../../types';
import { IDevelopmentSerializedState } from './development-serialized-state';
import { IMoneySerializedState } from './money-serialized-state';
import { ITimeSerializedState } from './time-serialized-state';
import { IUnlockedFeaturesSerializedState } from './unlocked-features-serialized-state';
import { IScenarioSerializedState } from './scenario-serialized-state';
import { IMultipliersSerializedState } from './multipliers-serialized-state';
import { IFactionSerializedState } from './factions-serialized-state';
import { IAvailableItemsSerializedState } from './available-items-serialized-state';
import { IConnectivitySerializedState } from './connectivity-serialized-state';
import { IRewardsSerializedState } from './rewards-serialized-state';

export interface IGlobalSerializedState {
  randomSeed: string;
  randomShift: string;
  runId: string;
  scenario: IScenarioSerializedState;
  faction: IFactionSerializedState;
  gameSpeed: GameSpeed;
  money: IMoneySerializedState;
  time: ITimeSerializedState;
  development: IDevelopmentSerializedState;
  connectivity: IConnectivitySerializedState;
  multipliers: IMultipliersSerializedState;
  availableItems: IAvailableItemsSerializedState;
  unlockedFeatures: IUnlockedFeaturesSerializedState;
  rewards: IRewardsSerializedState;
}
