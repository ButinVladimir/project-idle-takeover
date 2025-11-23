import { calculateTierLinear } from '@shared/helpers';
import { MultiplierProgramName } from '../types';
import { BaseProgram } from './base-program';
import { typedPrograms } from '../constants';

export class DealMakerProgram extends BaseProgram {
  public readonly name = MultiplierProgramName.dealMaker;
  public readonly isAutoscalable = false;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    this.globalState.rewards.increasePointsByProgram(this.calculateDelta(threads));
  }

  calculateDelta(threads: number): number {
    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.rewards;

    return Math.pow(
      multiplier *
        this.globalState.rewards.multiplierByProgram *
        threads *
        calculateTierLinear(this.level, this.tier, programData.rewards),
      exponent,
    );
  }
}
