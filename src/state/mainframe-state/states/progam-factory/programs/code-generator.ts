import { calculateTierLinear, DistrictTypeRewardParameter } from '@shared/index';
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
    if (!this.unlockState.milestones.isRewardParameterUnlocked(DistrictTypeRewardParameter.codeBase)) {
      return 0;
    }

    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.codeBase;

    return (
      multiplier *
      threads *
      Math.pow(
        this.globalState.rewards.multiplierByProgram * calculateTierLinear(this.level, this.tier, programData.codeBase),
        exponent,
      )
    );
  }
}
