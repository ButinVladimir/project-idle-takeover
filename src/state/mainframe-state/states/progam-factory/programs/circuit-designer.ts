import programs from '@configs/programs.json';
import { calculateTierLinear } from '@shared/helpers';
import { MultiplierProgramName } from '../types';
import { BaseProgram } from './base-program';

export class CircuitDesignerProgram extends BaseProgram {
  public readonly name = MultiplierProgramName.circuitDesigner;
  public readonly isAutoscalable = false;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    this.globalState.multipliers.computationalBase.increasePointsByProgram(this.calculateDelta(threads));
  }

  calculateDelta(threads: number): number {
    const programData = programs[this.name];

    return (
      this.scenarioState.currentValues.programMultipliers.computationalBase.pointsMultiplier *
      this.globalState.rewards.multiplierByProgram *
      threads *
      calculateTierLinear(this.level, this.tier, programData.computationalBase)
    );
  }
}
