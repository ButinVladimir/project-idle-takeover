import { BaseController } from '@shared/index';
import { IProgram } from '@state/mainframe-state';

export class OwnedProgramsListItemButtonsController extends BaseController {
  calculateUpgradeLevel(program: IProgram) {
    if (!this.globalState.availableItems.programs.isItemAvailable(program.name, program.tier)) {
      return 0;
    }

    return this.mainframeState.programs.calculateLevelFromMoney(
      program.name,
      program.tier,
      this.globalState.money.money,
    );
  }

  checkCanUpgradeMax(program: IProgram) {
    if (!this.globalState.availableItems.programs.isItemAvailable(program.name, program.tier)) {
      return false;
    }

    return (
      this.globalState.money.money >=
      this.mainframeState.programs.calculateProgramCost(program.name, program.tier, program.level + 1)
    );
  }

  upgradeMaxProgram(program: IProgram) {
    this.mainframeState.programs.upgrader.upgradeMaxProgram(program.name);
  }
}
