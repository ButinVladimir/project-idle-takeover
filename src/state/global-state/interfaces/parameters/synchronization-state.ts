export interface ISynchronizationState {
  baseValue: number;
  availableValue: number;
  totalValue: number;
  recalculate(): void;
}
