import { BaseController } from '@shared/index';
import { IProgram, ProgramValidationResult } from '@state/mainframe-state';

export class OwnedProgramsListItemButtonsController extends BaseController {
  calculateUpgradeLevel(program: IProgram) {
    if (!this.checkProgramUpgradeAvailable(program)) {
      return 0;
    }

    return this.mainframeState.programs.upgrader.calculateLevelFromMoney(
      program.name,
      program.tier,
      this.globalState.money.money,
    );
  }

  checkCanUpgradeMax(program: IProgram) {
    if (!this.checkProgramUpgradeAvailable(program)) {
      return false;
    }

    return (
      this.mainframeState.programs.validator.validateProgram(program.name, program.tier, program.level + 1) ===
      ProgramValidationResult.valid
    );
  }

  upgradeMaxProgram(program: IProgram) {
    this.mainframeState.programs.upgrader.upgradeMaxProgram(program.name);
  }

  private checkProgramUpgradeAvailable(program: IProgram): boolean {
    return this.unlockState.items.programs.isItemAvailable(program.name, program.tier, program.level + 1);
  }
}
