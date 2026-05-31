import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { Milestone, reverseTierPower } from '@shared/index';
import { type IGlobalState } from '@state/global-state';
import { type IAutomationState } from '@state/automation-state';
import { type IUnlockState } from '@state/unlock-state';
import { IProgram, ProgramName, typedPrograms } from '../progam-factory';
import { IMainframeProgramsUpgrader } from './interfaces';
import { type IMainframeState } from '../../interfaces';

const { lazyInject } = decorators;

@injectable()
export class MainframeProgramsUpgrader implements IMainframeProgramsUpgrader {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  private _availableMoney = 0;

  private _availableActions = 0;

  upgradeMaxPrograms(programNames: ProgramName[]): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    const programs = programNames
      .map((programName) => this._mainframeState.programs.getOwnedProgramByName(programName))
      .filter((program) => program) as IProgram[];

    this._availableMoney = this._globalState.money.money;
    this._availableActions = Number.MAX_SAFE_INTEGER;

    this.performUpgradePrograms(programs);
  }

  upgradeMaxProgram(programName: ProgramName): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    const existingProgram = this._mainframeState.programs.getOwnedProgramByName(programName);

    if (!existingProgram) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = Number.MAX_SAFE_INTEGER;

    this.performUpgradeProgram(existingProgram);
  }

  autoupgrade(actionCount: number): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    const programs = this._mainframeState.programs.listOwnedPrograms();

    this._availableMoney = (this._globalState.money.money * this._automationState.mainframePrograms.moneyShare) / 100;
    this._availableActions = actionCount;

    this.performUpgradePrograms(programs);
  }

  calculateLevelFromMoney(name: ProgramName, tier: number, money: number): number {
    const programData = typedPrograms[name];

    const availableMoney = money * this._globalState.multipliers.codeBase.totalMultiplier;

    return Math.min(reverseTierPower(availableMoney, tier, programData.cost), this._globalState.development.level);
  }

  private checkUpgradeAvailable() {
    return this._unlockState.milestones.isMilestoneReached(Milestone.unlockedMainframePrograms);
  }

  private performUpgradePrograms(programs: IProgram[]) {
    for (const existingProgram of programs) {
      if (this._availableActions <= 0) {
        break;
      }

      if (!existingProgram.autoUpgradeEnabled) {
        continue;
      }

      this.performUpgradeProgram(existingProgram);
    }
  }

  private performUpgradeProgram(existingProgram: IProgram) {
    const oldLevel = existingProgram.level;
    const newLevel = Math.min(
      this.calculateLevelFromMoney(existingProgram.name, existingProgram.tier, this._availableMoney),
      existingProgram.level + this._availableActions,
    );

    if (newLevel > existingProgram.level) {
      const cost = this._mainframeState.programs.validator.calculateProgramCost(
        existingProgram.name,
        existingProgram.tier,
        newLevel,
      );

      if (this._mainframeState.programs.purchaseProgramsBatch([existingProgram.name], existingProgram.tier, newLevel)) {
        this._availableMoney -= cost;
        this._availableActions -= newLevel - oldLevel;
      }
    }
  }
}
