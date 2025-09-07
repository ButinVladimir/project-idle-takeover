import { ISerializeable } from '@shared/index';
import { IUnlockSerializedState } from './serialized-states';
import { IUnlockedFeaturesState } from './unlocked-features-state';
import { IAvailableItemsState } from './available-items-state';
import { IAvailableActivitiesState } from './available-activities-state';

export interface IUnlockState extends ISerializeable<IUnlockSerializedState> {
  features: IUnlockedFeaturesState;
  items: IAvailableItemsState;
  activities: IAvailableActivitiesState;
  requestRecalculation(): void;
  recalculate(): void;
}
