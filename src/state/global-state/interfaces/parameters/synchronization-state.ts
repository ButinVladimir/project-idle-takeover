export interface ISynchronizationState {
  baseValue: number;
  availableValue: number;
  totalValue: number;
  requestRecalculation(): void;
  recalculate(): void;
}
