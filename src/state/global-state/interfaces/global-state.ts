import { XORShift128Plus } from 'random-seedable';
import { ISerializeable } from '@shared/interfaces';
import { IGlobalSerializedState } from './serialized-states';
import { GameSpeed } from '../types';
import {
  IMoneyState,
  ITimeState,
  IDevelopmentState,
  IMultipliersState,
  IConnectivityState,
  IThreatState,
  ISynchronizationState,
  IExperienceShareState,
  IProcessCompletionSpeedState,
  IRewardsState,
} from './parameters';

export interface IGlobalState extends ISerializeable<IGlobalSerializedState> {
  random: XORShift128Plus;
  runId: string;
  gameSpeed: GameSpeed;
  money: IMoneyState;
  time: ITimeState;
  development: IDevelopmentState;
  threat: IThreatState;
  synchronization: ISynchronizationState;
  connectivity: IConnectivityState;
  rewards: IRewardsState;
  multipliers: IMultipliersState;
  experienceShare: IExperienceShareState;
  processCompletionSpeed: IProcessCompletionSpeedState;
  recalculate(): void;
  makeNextTick(): void;
}
