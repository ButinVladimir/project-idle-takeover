import { BaseController, Hotkey } from '@shared/index';

export class MainframeHardwarePanelButtonsController extends BaseController {
  checkCanPurchaseMax(): boolean {
    return this.mainframeState.hardware
      .listParameters()
      .some(
        (parameter) =>
          parameter.autoUpgradeEnabled && this.mainframeState.hardware.validator.validateHardware(parameter.type, 1),
      );
  }

  purchaseMax() {
    this.mainframeState.hardware.upgrader.upgradeMaxAllParameters();
  }

  getUpgradeMainframeHardwareHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframeHardware);
  }

  getUpgradeMainframePerformanceHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframePerformance);
  }

  getUpgradeMainframeRamHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframeRam);
  }

  getUpgradeMainframeCoresHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeMainframeCores);
  }
}
