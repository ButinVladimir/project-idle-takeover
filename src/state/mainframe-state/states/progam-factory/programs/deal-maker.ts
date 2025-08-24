import programs from '@configs/programs.json';
import { calculateTierLinear } from '@shared/helpers';
import { MultiplierProgramName } from '../types';
import { BaseProgram } from './base-program';

export class DealMakerProgram extends BaseProgram {
  public readonly name = MultiplierProgramName.dealMaker;
  public readonly isAutoscalable = false;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    this.globalState.rewards.increasePointsByProgram(this.calculateDelta(threads));
  }

  calculateDelta(threads: number): number {
    const programData = programs[this.name];

    return (
      this.globalState.scenario.currentValues.programMultipliers.rewards.pointsMultiplier *
      this.globalState.rewards.multiplierByProgram *
      threads *
      calculateTierLinear(this.level, this.tier, programData.rewards)
    );
  }
}
