import { BaseController, Hotkey } from '@shared/index';

export class MainframeHardwarePanelButtonsController extends BaseController {
  checkCanPurchaseMax(): boolean {
    return this.mainframeState.hardware
      .listParameters()
      .some((parameter) => parameter.autoUpgradeEnabled && parameter.checkCanPurchase(1));
  }

  purchaseMax() {
    this.mainframeState.hardware.upgrader.upgradeMaxAllParameters();
  }

  getHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframeHardware);
  }
}
