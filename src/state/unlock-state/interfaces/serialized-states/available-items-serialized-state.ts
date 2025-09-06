import { ProgramName } from '@state/mainframe-state';
import { CloneTemplateName } from '@state/company-state';
import { IAvailableCategoryItemsSerializedState } from './available-category-items-serialized-state';

export interface IAvailableItemsSerializedState {
  programs: IAvailableCategoryItemsSerializedState<ProgramName>;
  cloneTemplates: IAvailableCategoryItemsSerializedState<CloneTemplateName>;
}
