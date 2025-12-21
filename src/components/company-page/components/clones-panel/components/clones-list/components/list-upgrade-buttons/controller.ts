import { IClone } from '@state/clones-state';
import { BaseController, Hotkey } from '@shared/index';

export class ClonesListUpgradeButtonsController extends BaseController {
  checkCanUpgradeMaxAllLevels(): boolean {
    return this.clonesState.ownedClones.listClones().some(this.checkCanUpgradeMaxLevel);
  }

  upgradeMaxAllLevels() {
    this.clonesState.ownedClones.levelUpgrader.upgradeMaxAllClones();
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
      this.clonesState.ownedClones.calculateCloneCost(clone.templateName, clone.tier, clone.level + 1)
    );
  };
}
