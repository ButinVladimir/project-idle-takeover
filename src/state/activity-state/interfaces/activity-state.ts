import { ISerializeable } from '@shared/index';
import { IActivitySerializedState } from './activity-serialized-state';
import { ISidejobsState } from '../states';

export interface IActivityState extends ISerializeable<IActivitySerializedState> {
  sidejobs: ISidejobsState;
  requestReassignment(): void;
  processTick(): void;
}
