import { calculateLinear, calculateTierLinear } from '@shared/index';
import { OtherProgramName } from '../types';
import { BaseProgram } from './base-program';
import { typedPrograms } from '../constants';

export class PeerReviewerProgram extends BaseProgram {
  public readonly name = OtherProgramName.peerReviewer;
  public readonly isAutoscalable = true;

  handlePerformanceUpdate(): void {
    this.globalState.experienceShare.requestRecalculation();
  }

  perform(): void {}

  calculateExperienceShareMultiplier(threads: number, usedRam: number): number {
    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.experienceShareMultiplier;

    return Math.pow(
      1 +
        multiplier *
          calculateTierLinear(this.level, this.tier, programData.cloneExperience.main) *
          calculateLinear(
            this.mainframeState.hardware.performance.totalLevel,
            this.scenarioState.currentValues.mainframeSoftware.performanceBoost,
          ) *
          calculateLinear(usedRam, programData.cloneExperience.ram) *
          calculateLinear(threads, programData.cloneExperience.cores),
      exponent,
    );
  }
}
