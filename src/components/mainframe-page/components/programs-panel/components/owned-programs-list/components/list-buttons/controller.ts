import { BaseController, Hotkey } from '@shared/index';
import { IProgram } from '@state/mainframe-state';

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

    if (!this.globalState.availableItems.programs.isItemAvailable(program.name, program.tier)) {
      return false;
    }

    return (
      this.globalState.money.money >=
      this.mainframeState.programs.getProgramCost(program.name, program.tier, program.level + 1)
    );
  };
}
