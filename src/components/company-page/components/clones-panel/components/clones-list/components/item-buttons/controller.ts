import { IClone } from '@state/company-state';
import { BaseController } from '@shared/index';

export class ClonesListItemButtonsController extends BaseController {
  calculateUpgradeLevel(clone: IClone) {
    if (!this.unlockState.items.cloneTemplates.isItemAvailable(clone.templateName, clone.tier)) {
      return 0;
    }

    return this.companyState.clones.calculateCloneLevelFromMoney(
      clone.templateName,
      clone.tier,
      this.globalState.money.money,
    );
  }

  checkCanUpgradeCloneLevel(clone: IClone): boolean {
    if (!this.unlockState.items.cloneTemplates.isItemAvailable(clone.templateName, clone.tier)) {
      return false;
    }

    return (
      this.globalState.money.money >=
      this.companyState.clones.calculateCloneCost(clone.templateName, clone.tier, clone.level + 1)
    );
  }

  upgradeCloneLevel(clone: IClone) {
    this.companyState.clones.levelUpgrader.upgradeMaxClone(clone.id);
  }
}
