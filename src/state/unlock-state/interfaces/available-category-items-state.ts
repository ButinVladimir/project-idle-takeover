import { ISerializeable } from '@shared/index';
import { IAvailableCategoryItemsSerializedState } from './serialized-states';

export interface IAvailableCategoryItemsState<Key extends string = string> extends ISerializeable<
  IAvailableCategoryItemsSerializedState<Key>
> {
  listAvailableItems(): Key[];
  listDesigns(): Key[];
  listLoanedItems(): Key[];
  isItemAvailable(itemName: Key, tier: number, level: number): boolean;
  getItemHighestAvailableTier(itemName: Key): number;
  getDesignTier(itemName: Key): number;
  unlockDesign(itemName: Key, tier: number, notify: boolean): void;
  makeUnlockNotificationMessage(itemName: Key, formattedTier: string): string;
  recalculate(): void;
}
