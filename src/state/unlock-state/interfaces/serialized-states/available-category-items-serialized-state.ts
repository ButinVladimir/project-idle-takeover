export interface IAvailableCategoryItemsSerializedState<Key extends string = string> {
  designs: Record<Key, number>;
}
