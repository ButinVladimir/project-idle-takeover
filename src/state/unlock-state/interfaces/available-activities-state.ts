import { ISerializeable } from '@shared/index';
import { IAvailableActivitiesSerializedState } from './serialized-states';
import { IAvailableCategoryActivitiesState } from './available-category-activities-state';

export interface IAvailableActivitiesState extends ISerializeable<IAvailableActivitiesSerializedState> {
  sidejobs: IAvailableCategoryActivitiesState;
  contracts: IAvailableCategoryActivitiesState;
  recalculate(): void;
}
