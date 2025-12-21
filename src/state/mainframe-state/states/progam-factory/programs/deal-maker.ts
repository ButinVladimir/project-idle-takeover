import { DistrictTypeRewardParameter, calculateTierLinear } from '@shared/index';
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
    if (!this.unlockState.milestones.isRewardParameterUnlocked(DistrictTypeRewardParameter.rewards)) {
      return 0;
    }

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
