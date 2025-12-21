import { ISerializeable } from '@shared/index';
import { IUnlockSerializedState } from './serialized-states';
import { IReachedMilestonesState } from './reached-milestones-state';
import { IAvailableItemsState } from './available-items-state';
import { IAvailableActivitiesState } from './available-activities-state';

export interface IUnlockState extends ISerializeable<IUnlockSerializedState> {
  milestones: IReachedMilestonesState;
  items: IAvailableItemsState;
  activities: IAvailableActivitiesState;
  recalculate(): void;
}
