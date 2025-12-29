import { IAvailableCategoryActivitiesSerializedState } from './available-category-activities-serialized-state';

export interface IAvailableActivitiesSerializedState {
  sidejobs: IAvailableCategoryActivitiesSerializedState;
  contracts: IAvailableCategoryActivitiesSerializedState;
}
