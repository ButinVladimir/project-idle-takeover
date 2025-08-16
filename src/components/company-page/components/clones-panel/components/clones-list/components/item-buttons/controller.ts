import { IClone } from '@state/company-state';
import { BaseController } from '@shared/index';

export class ClonesListItemButtonsController extends BaseController {
  checkCanUpgradeCloneLevel(clone: IClone): boolean {
    if (
      !this.globalState.availableItems.cloneTemplates.isItemAvailable(clone.templateName, clone.tier, clone.level + 1)
    ) {
      return false;
    }

    return (
      this.globalState.money.money >=
      this.companyState.clones.getCloneCost(clone.templateName, clone.tier, clone.level + 1)
    );
  }

  upgradeCloneLevel(clone: IClone) {
    this.companyState.clones.levelUpgrader.upgradeMaxClone(clone.id);
  }
}
