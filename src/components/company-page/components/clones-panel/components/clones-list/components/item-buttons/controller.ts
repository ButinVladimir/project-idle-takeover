import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class ClonesListItemButtonsController extends BaseController {
  calculateUpgradeLevel(clone: IClone) {
    if (!this.checkCloneUpgradeAvailable(clone)) {
      return 0;
    }

    return this.clonesState.ownedClones.calculateCloneLevelFromMoney(
      clone.templateName,
      clone.tier,
      this.globalState.money.money,
    );
  }

  checkCanUpgradeCloneLevel(clone: IClone): boolean {
    if (!this.checkCloneUpgradeAvailable(clone)) {
      return false;
    }

    return (
      this.globalState.money.money >=
      this.clonesState.ownedClones.calculateCloneCost(clone.templateName, clone.tier, clone.level + 1)
    );
  }

  upgradeCloneLevel(clone: IClone) {
    this.clonesState.ownedClones.levelUpgrader.upgradeMaxClone(clone.id);
  }

  private checkCloneUpgradeAvailable(clone: IClone): boolean {
    return this.unlockState.items.cloneTemplates.isItemAvailable(clone.templateName, clone.tier, clone.level + 1);
  }
}
