import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { TYPES } from '@state/types';
import { calculateTierPower, Milestone } from '@shared/index';
import { IMainframeProgramsValidator } from './interfaces';
import { ProgramName, typedPrograms } from '../progam-factory';
import { ProgramsBatchValidationResult, ProgramValidationResult } from './types';

const { lazyInject } = decorators;

@injectable()
export class MainframeProgramsValidator implements IMainframeProgramsValidator {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  calculateProgramCost(name: ProgramName, tier: number, level: number): number {
    const programData = typedPrograms[name];

    return calculateTierPower(level, tier, programData.cost) / this._globalState.multipliers.codeBase.totalMultiplier;
  }

  validateProgram(name: ProgramName, tier: number, level: number): ProgramValidationResult {
    if (!this._unlockState.items.programs.isItemAvailable(name, tier, level)) {
      return ProgramValidationResult.programNotAvailable;
    }

    return ProgramValidationResult.valid;
  }

  validateProgramsBatch(names: ProgramName[], tier: number, level: number): ProgramsBatchValidationResult {
    if (!this._unlockState.milestones.isMilestoneReached(Milestone.unlockedMainframePrograms)) {
      return ProgramsBatchValidationResult.programsLocked;
    }

    const programValidationResults = names.map((name) => this.validateProgram(name, tier, level));

    if (programValidationResults.includes(ProgramValidationResult.programNotAvailable)) {
      return ProgramsBatchValidationResult.programsNotAvailable;
    }

    const totalCost = names.reduce((sum, name) => sum + this.calculateProgramCost(name, tier, level), 0);

    if (totalCost > this._globalState.money.money) {
      return ProgramsBatchValidationResult.notEnoughMoney;
    }

    return ProgramsBatchValidationResult.valid;
  }
}
