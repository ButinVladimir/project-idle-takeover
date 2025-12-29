import { ProgramName } from '@state/mainframe-state';
import { IAvailableCategoryItemsSerializedState } from './available-category-items-serialized-state';

export interface IAvailableItemsSerializedState {
  programs: IAvailableCategoryItemsSerializedState<ProgramName>;
  cloneTemplates: IAvailableCategoryItemsSerializedState<string>;
}
