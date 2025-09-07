import { ISerializeable } from '@shared/interfaces/serializable';
import { IAvailableItemsSerializedState } from './serialized-states';
import { IAvailableCategoryItemsState } from './available-category-items-state';
import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';
import { CloneTemplateName } from '@state/company-state/states/clone-factory/types';

export interface IAvailableItemsState extends ISerializeable<IAvailableItemsSerializedState> {
  programs: IAvailableCategoryItemsState<ProgramName>;
  cloneTemplates: IAvailableCategoryItemsState<CloneTemplateName>;
  recalculate(): void;
}
