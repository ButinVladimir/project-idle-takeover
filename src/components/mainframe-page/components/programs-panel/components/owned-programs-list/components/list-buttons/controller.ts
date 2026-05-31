import { BaseController } from '@shared/index';
import { IProgram, ProgramName, ProgramValidationResult } from '@state/mainframe-state';

export class OwnedProgramsListButtonsController extends BaseController {
  upgradeMaxPrograms(programNames: ProgramName[]) {
    this.mainframeState.programs.upgrader.upgradeMaxPrograms(programNames);
  }

  checkCanUpgradeMaxProgram = (program: IProgram) => {
    if (!program.autoUpgradeEnabled) {
      return false;
    }

    if (
      this.globalState.money.money <
      this.mainframeState.programs.validator.calculateProgramCost(program.name, program.tier, program.level + 1)
    ) {
      return false;
    }

    return (
      this.mainframeState.programs.validator.validateProgram(program.name, program.tier, program.level + 1) ===
      ProgramValidationResult.valid
    );
  };
}
