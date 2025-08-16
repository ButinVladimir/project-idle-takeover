import { BaseController } from '@shared/index';
import { IProgram } from '@state/mainframe-state';

export class OwnedProgramsListItemButtonsController extends BaseController {
  checkCanUpgradeMax(program: IProgram) {
    if (!this.globalState.availableItems.programs.isItemAvailable(program.name, program.tier, program.level + 1)) {
      return false;
    }

    return (
      this.globalState.money.money >=
      this.mainframeState.programs.getProgramCost(program.name, program.tier, program.level + 1)
    );
  }

  upgradeMaxProgram(program: IProgram) {
    this.mainframeState.programs.upgrader.upgradeMaxProgram(program.name);
  }
}
