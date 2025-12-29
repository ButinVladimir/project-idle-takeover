import { ISerializeable } from '@shared/index';
import { IAvailableCategoryActivitiesSerializedState } from './serialized-states';

export interface IAvailableCategoryActivitiesState extends ISerializeable<IAvailableCategoryActivitiesSerializedState> {
  listUnlockedActivities(): string[];
  listAvailableActivities(): string[];
  isActivityUnlocked(activity: string): boolean;
  isActivityAvailable(activity: string): boolean;
  unlockActivity(activitiy: string): void;
  makeUnlockActivityMessage(activity: string): string;
  recalculate(): void;
}
