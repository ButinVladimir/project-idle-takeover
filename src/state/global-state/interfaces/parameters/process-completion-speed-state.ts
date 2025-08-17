export interface IProcessCompletionSpeedState {
  multiplierByHardware: number;
  multiplierByProgram: number;
  totalMultiplier: number;
  requestRecalculation(): void;
  recalculate(): void;
}
