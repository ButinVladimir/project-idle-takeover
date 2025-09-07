import { IAvailableActivitiesSerializedState } from './available-activities-serialized-state';
import { IAvailableItemsSerializedState } from './available-items-serialized-state';
import { IUnlockedFeaturesSerializedState } from './unlocked-features-serialized-state';

export interface IUnlockSerializedState {
  features: IUnlockedFeaturesSerializedState;
  activities: IAvailableActivitiesSerializedState;
  items: IAvailableItemsSerializedState;
}
