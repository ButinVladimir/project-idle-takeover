import { calculateLinear, calculateTierLinear } from '@shared/index';
import { OtherProgramName } from '../types';
import { BaseProgram } from './base-program';
import { typedPrograms } from '../constants';

export class PredictiveComputatorProgram extends BaseProgram {
  public readonly name = OtherProgramName.predictiveComputator;
  public readonly isAutoscalable = true;

  handlePerformanceUpdate(): void {
    this.globalState.processCompletionSpeed.requestRecalculation();
  }

  perform(): void {}

  calculateProcessCompletionSpeedMultiplier(threads: number, usedRam: number): number {
    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.processCompletionSpeed;

    return Math.pow(
      1 +
        multiplier *
          calculateTierLinear(this.level, this.tier, programData.programCompletionSpeed.main) *
          calculateLinear(
            this.mainframeState.hardware.performance.totalLevel,
            this.scenarioState.currentValues.mainframeSoftware.performanceBoost,
          ) *
          calculateLinear(usedRam, programData.programCompletionSpeed.ram) *
          calculateLinear(threads, programData.programCompletionSpeed.cores),
      exponent,
    );
  }
}
