import { CloneValidationResult, IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class PurchaseCloneDialogButtonsController extends BaseController {
  get money(): number {
    return this.globalState.money.money;
  }

  get moneyGrowth(): number {
    return this.growthState.money.totalGrowth;
  }

  getCloneCost(cloneTemplateName: string, tier: number, level: number): number {
    return this.clonesState.ownedClones.validator.calculateCloneCost(cloneTemplateName, tier, level);
  }

  validateClone(clone: IClone): CloneValidationResult {
    return this.clonesState.ownedClones.validator.validateClone(clone);
  }
}
