import { CloneValidationResult, IClone } from '@state/clones-state';
import { BaseController, Hotkey } from '@shared/index';

export class ClonesListUpgradeButtonsController extends BaseController {
  upgradeMaxDisplayedLevels(ids: string[]) {
    this.clonesState.ownedClones.levelUpgrader.upgradeMaxClones(ids);
  }

  getUpgradeLevelHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.upgradeClonesLevel);
  }

  checkCanUpgradeMaxLevel = (clone: IClone) => {
    if (!clone.autoUpgradeEnabled) {
      return false;
    }

    return (
      this.clonesState.ownedClones.validator.validateClone({
        name: clone.name,
        templateName: clone.templateName,
        tier: clone.tier,
        level: clone.level + 1,
      }) === CloneValidationResult.valid
    );
  };
}
