import { BaseController, Hotkey } from '@shared/index';
import { IProgram, ProgramValidationResult } from '@state/mainframe-state';

export class OwnedProgramsListButtonsController extends BaseController {
  listOwnedPrograms(): IProgram[] {
    return this.mainframeState.programs.listOwnedPrograms();
  }

  toggleAutoUpgrade(active: boolean) {
    this.mainframeState.programs.toggleProgramsAutoUpgrade(active);
  }

  checkCanUpgradeMax(): boolean {
    return this.mainframeState.programs.listOwnedPrograms().some(this.checkCanUpgradeMaxProgram);
  }

  upgradeMaxAllPrograms() {
    this.mainframeState.programs.upgrader.upgradeMaxAllPrograms();
  }

  getHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframePrograms);
  }

  private checkCanUpgradeMaxProgram = (program: IProgram) => {
    if (!program.autoUpgradeEnabled) {
      return false;
    }

    return (
      this.mainframeState.programs.validator.validateProgram(program.name, program.tier, program.level + 1) ===
      ProgramValidationResult.valid
    );
  };
}
