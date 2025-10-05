import { IClone } from '@state/company-state';
import { BaseController, Hotkey } from '@shared/index';

export class ClonesListUpgradeButtonsController extends BaseController {
  checkCanUpgradeMaxAllLevels(): boolean {
    return this.companyState.clones.listClones().some(this.checkCanUpgradeMaxLevel);
  }

  upgradeMaxAllLevels() {
    this.companyState.clones.levelUpgrader.upgradeMaxAllClones();
  }

  getUpgradeLevelHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeClonesLevel);
  }

  private checkCanUpgradeMaxLevel = (clone: IClone) => {
    if (!clone.autoUpgradeEnabled) {
      return false;
    }

    if (!this.unlockState.items.cloneTemplates.isItemAvailable(clone.templateName, clone.tier, clone.level + 1)) {
      return false;
    }

    return (
      this.globalState.money.money >=
      this.companyState.clones.calculateCloneCost(clone.templateName, clone.tier, clone.level + 1)
    );
  };
}
