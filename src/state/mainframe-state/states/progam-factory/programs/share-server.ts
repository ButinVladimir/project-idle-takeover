import { type ISettingsState } from '@state/settings-state';
import { calculateLinear, calculateTierLinear, DistrictTypeRewardParameter, IncomeSource } from '@shared/index';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { OtherProgramName } from '../types';
import { BaseProgram } from './base-program';
import { typedPrograms } from '../constants';

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
    if (!this.unlockState.milestones.isRewardParameterUnlocked(DistrictTypeRewardParameter.money)) {
      return 0;
    }

    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.money;

    return (
      passedTime *
      multiplier *
      Math.pow(
        this.calculateCommonOuterModifier() *
          calculateTierLinear(this.level, this.tier, programData.money.main) *
          calculateLinear(usedRam, programData.money.ram) *
          calculateLinear(threads, programData.money.cores),
        exponent,
      )
    );
  }

  calculateDevelopmentPointsDelta(threads: number, usedRam: number, passedTime: number): number {
    if (!this.unlockState.milestones.isRewardParameterUnlocked(DistrictTypeRewardParameter.developmentPoints)) {
      return 0;
    }

    const programData = typedPrograms[this.name];
    const { multiplier, exponent } = this.scenarioState.currentValues.programMultipliers.developmentPoints;

    return (
      passedTime *
      multiplier *
      Math.pow(
        this.calculateCommonOuterModifier() *
          calculateTierLinear(this.level, this.tier, programData.developmentPoints.main) *
          calculateLinear(usedRam, programData.developmentPoints.ram) *
          calculateLinear(threads, programData.developmentPoints.cores),
        exponent,
      )
    );
  }

  private calculateCommonOuterModifier(): number {
    const hardwareMultiplier = calculateLinear(
      this.mainframeState.hardware.performance.totalLevel,
      this.scenarioState.currentValues.mainframeSoftware.performanceBoost,
    );

    return this.globalState.rewards.multiplierByProgram * hardwareMultiplier;
  }
}
