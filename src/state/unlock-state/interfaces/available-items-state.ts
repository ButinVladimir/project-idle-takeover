import { ISerializeable } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';
import { IAvailableItemsSerializedState } from './serialized-states';
import { IAvailableCategoryItemsState } from './available-category-items-state';

export interface IAvailableItemsState extends ISerializeable<IAvailableItemsSerializedState> {
  programs: IAvailableCategoryItemsState<ProgramName>;
  cloneTemplates: IAvailableCategoryItemsState<string>;
  recalculate(): void;
}
