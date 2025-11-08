import { calculateTierLinear } from '@shared/helpers';
import { MultiplierProgramName } from '../types';
import { BaseProgram } from './base-program';
import { typedPrograms } from '../constants';

export class CodeGeneratorProgram extends BaseProgram {
  public readonly name = MultiplierProgramName.codeGenerator;
  public readonly isAutoscalable = false;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    this.globalState.multipliers.codeBase.increasePointsByProgram(this.calculateDelta(threads));
  }

  calculateDelta(threads: number): number {
    const programData = typedPrograms[this.name];

    return (
      this.scenarioState.currentValues.programMultipliers.codeBase.pointsMultiplier *
      this.globalState.rewards.multiplierByProgram *
      threads *
      calculateTierLinear(this.level, this.tier, programData.codeBase)
    );
  }
}
