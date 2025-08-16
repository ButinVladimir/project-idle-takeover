import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { binarySearchDecimal, Feature } from '@shared/index';
import { type IGlobalState } from '@state/global-state';
import { type IAutomationState } from '@state/automation-state';
import { IProgram, ProgramName } from '../progam-factory';
import { IMainframeProgramsUpgrader } from './interfaces';
import { type IMainframeState } from '../../interfaces';

const { lazyInject } = decorators;

export class MainframeProgramsUpgrader implements IMainframeProgramsUpgrader {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  private _availableMoney = 0;

  private _availableActions = 0;

  upgradeMaxAllPrograms(): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions =
      this._globalState.development.level * this._mainframeState.programs.listOwnedPrograms().length;

    this.performUpgradeAll();
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
    this._availableActions = this._globalState.development.level;

    this.performUpgradeProgram(existingProgram);
  }

  autoupgrade(actionCount: number): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = (this._globalState.money.money * this._automationState.mainframePrograms.moneyShare) / 100;
    this._availableActions = actionCount;

    this.performUpgradeAll();
  }

  private checkUpgradeAvailable() {
    return this._globalState.unlockedFeatures.isFeatureUnlocked(Feature.mainframePrograms);
  }

  private performUpgradeAll() {
    for (const existingProgram of this._mainframeState.programs.listOwnedPrograms()) {
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
    const checkProgram = this.makeCheckProgramFunction(existingProgram);

    const maxLevel = Math.min(this._globalState.development.level, existingProgram.level + this._availableActions);

    const oldLevel = existingProgram.level;
    const newLevel = binarySearchDecimal(oldLevel, maxLevel, checkProgram);

    if (newLevel > existingProgram.level) {
      const cost = this._mainframeState.programs.getProgramCost(existingProgram.name, existingProgram.tier, newLevel);

      if (this._mainframeState.programs.purchaseProgram(existingProgram.name, existingProgram.tier, newLevel)) {
        this._availableMoney -= cost;
        this._availableActions -= newLevel - oldLevel;
      }
    }
  }

  private makeCheckProgramFunction =
    (existingProgram: IProgram) =>
    (level: number): boolean => {
      if (
        !this._globalState.availableItems.programs.isItemAvailable(existingProgram.name, existingProgram.tier, level)
      ) {
        return false;
      }

      const cost = this._mainframeState.programs.getProgramCost(existingProgram.name, existingProgram.tier, level);

      return cost <= this._availableMoney;
    };
}
