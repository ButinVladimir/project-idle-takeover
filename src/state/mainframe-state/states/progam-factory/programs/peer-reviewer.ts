import programs from '@configs/programs.json';
import { calculateLinear, calculateTierLinear } from '@shared/index';
import { OtherProgramName } from '../types';
import { BaseProgram } from './base-program';

export class PeerReviewerProgram extends BaseProgram {
  public readonly name = OtherProgramName.peerReviewer;
  public readonly isAutoscalable = true;

  handlePerformanceUpdate(): void {
    this.globalState.experienceShare.requestRecalculation();
  }

  perform(): void {}

  calculateExperienceShareMultiplier(threads: number, usedRam: number): number {
    const programData = programs[this.name];

    return (
      1 +
      calculateTierLinear(this.level, this.tier, programData.cloneExperience.main) *
        calculateLinear(
          this.mainframeState.hardware.performance.totalLevel,
          this.globalState.scenario.currentValues.mainframeSoftware.performanceBoost,
        ) *
        calculateLinear(usedRam, programData.cloneExperience.ram) *
        calculateLinear(threads, programData.cloneExperience.cores)
    );
  }
}
