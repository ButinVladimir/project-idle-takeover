import { BaseController, Hotkey } from '@shared/index';
import { IProgram, ProgramName, ProgramValidationResult } from '@state/mainframe-state';

export class OwnedProgramsListButtonsController extends BaseController {
  upgradeMaxPrograms(programNames: ProgramName[]) {
    this.mainframeState.programs.upgrader.upgradeMaxPrograms(programNames);
  }

  getHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframePrograms);
  }

  checkCanUpgradeMaxProgram = (program: IProgram) => {
    if (!program.autoUpgradeEnabled) {
      return false;
    }

    return (
      this.mainframeState.programs.validator.validateProgram(program.name, program.tier, program.level + 1) ===
      ProgramValidationResult.valid
    );
  };
}
