import { calculateTierLinear } from '@shared/index';
import { MultiplierProgramName } from '../types';
import { BaseProgram } from './base-program';
import { typedPrograms } from '../constants';

export class InformationCollectorProgram extends BaseProgram {
  public readonly name = MultiplierProgramName.informationCollector;
  public readonly isAutoscalable = false;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    this.globalState.connectivity.increasePointsByProgram(this.calculateDelta(threads));
  }

  calculateDelta(threads: number): number {
    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.connectivity;

    return Math.pow(
      multiplier *
        this.globalState.rewards.multiplierByProgram *
        threads *
        calculateTierLinear(this.level, this.tier, programData.connectivity),
      exponent,
    );
  }
}
