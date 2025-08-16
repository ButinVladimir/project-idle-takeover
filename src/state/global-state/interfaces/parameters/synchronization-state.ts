export interface ISynchronizationState {
  baseValue: number;
  totalValue: number;
  requestRecalculation(): void;
  recalculate(): void;
}
