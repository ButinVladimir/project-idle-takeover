import { BaseController, Hotkey } from '@shared/index';

export class CompanyClonesPanelController extends BaseController {
  getUpgradeClonesLevelHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeClonesLevel);
  }
}
