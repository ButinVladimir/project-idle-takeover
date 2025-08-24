import programs from '@configs/programs.json';
import { type ISettingsState } from '@state/settings-state';
import { calculateLinear, calculateTierLinear, IncomeSource } from '@shared/index';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { OtherProgramName } from '../types';
import { BaseProgram } from './base-program';

const { lazyInject } = decorators;

export class ShareServerProgram extends BaseProgram {
  public readonly name = OtherProgramName.shareServer;
  public readonly isAutoscalable = true;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  handlePerformanceUpdate(): void {}

  perform(threads: number, usedRam: number): void {
    const moneyDelta = this.calculateMoneyDelta(threads, usedRam, this._settingsState.updateInterval);
    const developmentPointsDelta = this.calculateDevelopmentPointsDelta(
      threads,
      usedRam,
      this._settingsState.updateInterval,
    );

    this.globalState.money.increase(moneyDelta, IncomeSource.program);
    this.globalState.development.increase(developmentPointsDelta, IncomeSource.program);
  }

  calculateMoneyDelta(threads: number, usedRam: number, passedTime: number): number {
    const programData = programs[this.name];

    return (
      this.globalState.scenario.currentValues.programMultipliers.money.pointsMultiplier *
      this.calculateModifier(passedTime) *
      calculateTierLinear(this.level, this.tier, programData.money.main) *
      calculateLinear(usedRam, programData.money.ram) *
      calculateLinear(threads, programData.money.cores)
    );
  }

  calculateDevelopmentPointsDelta(threads: number, usedRam: number, passedTime: number): number {
    const programData = programs[this.name];

    return (
      this.globalState.scenario.currentValues.programMultipliers.developmentPoints.pointsMultiplier *
      this.calculateModifier(passedTime) *
      calculateTierLinear(this.level, this.tier, programData.developmentPoints.main) *
      calculateLinear(usedRam, programData.developmentPoints.ram) *
      calculateLinear(threads, programData.developmentPoints.cores)
    );
  }

  private calculateModifier(passedTime: number): number {
    const hardwareMultiplier = calculateLinear(
      this.mainframeState.hardware.performance.totalLevel,
      this.globalState.scenario.currentValues.mainframeSoftware.performanceBoost,
    );

    return this.globalState.rewards.multiplierByProgram * passedTime * hardwareMultiplier;
  }
}
