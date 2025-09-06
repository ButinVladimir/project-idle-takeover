import { ISerializeable } from '@shared/index';
import { IAvailableActivitiesSerializedState } from './serialized-states';
import { IAvailableSidejobsState } from './activities';

export interface IAvailableActivitiesState extends ISerializeable<IAvailableActivitiesSerializedState>{
  sidejobs: IAvailableSidejobsState;
  requestRecalculation(): void;
  recalculate(): void;
}
