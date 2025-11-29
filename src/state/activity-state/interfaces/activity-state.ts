import { ISerializeable } from '@shared/index';
import { IActivitySerializedState } from './activity-serialized-state';
import { ISidejobActivityValidator, ISidejobsActivityState, ISidejobsFactory } from '../states';

export interface IActivityState extends ISerializeable<IActivitySerializedState> {
  sidejobsActivity: ISidejobsActivityState;
  sidejobsFactory: ISidejobsFactory;
  sidejobActivityValidator: ISidejobActivityValidator;
  requestReassignment(): void;
  processTick(): void;
}
