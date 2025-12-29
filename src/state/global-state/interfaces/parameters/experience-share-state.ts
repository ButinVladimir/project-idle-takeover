export interface IExperienceShareState {
  baseMultiplier: number;
  synchronizationMultiplier: number;
  programMultiplier: number;
  totalMultiplier: number;
  sharedExperience: number;
  resetExperience(): void;
  increaseExperience(delta: number): void;
  recalculate(): void;
}
