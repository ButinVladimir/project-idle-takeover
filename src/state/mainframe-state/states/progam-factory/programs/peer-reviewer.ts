import { calculateLinear, calculateTierLinear, DistrictTypeRewardParameter } from '@shared/index';
import { OtherProgramName } from '../types';
import { BaseProgram } from './base-program';
import { typedPrograms } from '../constants';

export class PeerReviewerProgram extends BaseProgram {
  public readonly name = OtherProgramName.peerReviewer;
  public readonly isAutoscalable = true;

  handlePerformanceUpdate(): void {}

  perform(): void {}

  calculateExperienceShareMultiplier(threads: number, usedRam: number): number {
    if (!this.unlockState.milestones.isRewardParameterUnlocked(DistrictTypeRewardParameter.experienceShareMultiplier)) {
      return 0;
    }

    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.experienceShareMultiplier;

    return (
      1 +
      multiplier *
        Math.pow(
          this.globalState.rewards.multiplierByProgram *
            calculateTierLinear(this.level, this.tier, programData.cloneExperience.main) *
            calculateLinear(
              this.mainframeState.hardware.performance.totalLevel,
              this.scenarioState.currentValues.mainframeSoftware.performanceBoost,
            ) *
            calculateLinear(usedRam, programData.cloneExperience.ram) *
            calculateLinear(threads, programData.cloneExperience.cores),
          exponent,
        )
    );
  }
}
