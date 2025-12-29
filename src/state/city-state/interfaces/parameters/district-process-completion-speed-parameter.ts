export interface IDistrictProcessCompletionSpeedParameter {
  value: number;
  recalculate(): void;
  removeAllEventListeners(): void;
}
