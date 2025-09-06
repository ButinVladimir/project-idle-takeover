import { ISerializeable } from '@shared/index';
import { IAvailableCategoryItemsSerializedState } from './serialized-states';

export interface IAvailableCategoryItemsState<Key extends string = string>
  extends ISerializeable<IAvailableCategoryItemsSerializedState<Key>> {
  listAvailableItems(): Key[];
  listDesigns(): Key[];
  listLoanedItems(): Key[];
  isItemAvailable(itemName: Key, tier: number): boolean;
  getItemHighestAvailableTier(itemName: Key): number;
  unlockDesign(itemName: Key, tier: number): void;
  recalculate(): void;
}
