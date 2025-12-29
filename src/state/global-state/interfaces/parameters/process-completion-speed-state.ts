export interface IProcessCompletionSpeedState {
  multiplierByHardware: number;
  multiplierByProgram: number;
  totalMultiplier: number;
  recalculate(): void;
}
