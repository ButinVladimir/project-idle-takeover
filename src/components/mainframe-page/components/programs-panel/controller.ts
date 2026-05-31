import { BaseController, Hotkey } from '@shared/index';

export class MainframeProgramsPanelController extends BaseController {
  getUpgradeProgramsHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframePrograms);
  }
}
