import { IAvailableActivitiesSerializedState } from './available-activities-serialized-state';
import { IAvailableItemsSerializedState } from './available-items-serialized-state';
import { IReachedMilestonesSerializedState } from './reached-milestones-serialized-state';

export interface IUnlockSerializedState {
  milestones: IReachedMilestonesSerializedState;
  activities: IAvailableActivitiesSerializedState;
  items: IAvailableItemsSerializedState;
}
