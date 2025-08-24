import { XORShift128Plus } from 'random-seedable';
import { ISerializeable } from '@shared/interfaces/serializable';
import { IGlobalSerializedState } from './serialized-states/global-serialized-state';
import { GameSpeed } from '../types';
import {
  IMoneyState,
  ITimeState,
  IDevelopmentState,
  IUnlockedFeaturesState,
  IStoryEventsState,
  IScenarioState,
  IFactionState,
  IMultipliersState,
  IAvailableItemsState,
  IConnectivityState,
  IThreatState,
  ISynchronizationState,
  IAvailableActivities,
  IExperienceShareState,
  IProcessCompletionSpeedState,
  IRewardsState,
} from './parameters';

export interface IGlobalState extends ISerializeable<IGlobalSerializedState> {
  random: XORShift128Plus;
  runId: string;
  scenario: IScenarioState;
  faction: IFactionState;
  gameSpeed: GameSpeed;
  money: IMoneyState;
  time: ITimeState;
  development: IDevelopmentState;
  threat: IThreatState;
  synchronization: ISynchronizationState;
  connectivity: IConnectivityState;
  rewards: IRewardsState;
  multipliers: IMultipliersState;
  availableItems: IAvailableItemsState;
  availableActivities: IAvailableActivities;
  unlockedFeatures: IUnlockedFeaturesState;
  storyEvents: IStoryEventsState;
  experienceShare: IExperienceShareState;
  processCompletionSpeed: IProcessCompletionSpeedState;
  recalculate(): void;
  makeNextTick(): void;
}
