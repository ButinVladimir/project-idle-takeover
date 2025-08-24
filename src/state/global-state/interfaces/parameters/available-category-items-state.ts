import { ISerializeable } from '@shared/interfaces/serializable';
import { IAvailableCategoryItemsSerializedState } from '../serialized-states/available-category-items-serialized-state';

export interface IAvailableCategoryItemsState<Key = string>
  extends ISerializeable<IAvailableCategoryItemsSerializedState<Key>> {
  loanedTier: number;
  listAvailableItems(): Key[];
  isItemAvailable(itemName: Key, tier: number): boolean;
  getItemHighestAvailableTier(itemName: Key): number;
  recalculate(): void;
}
