import { BaseController } from '@shared/index';
import { CloneTemplateName } from '@state/company-state';

export class PurchaseCloneDialogButtonsController extends BaseController {
  get money(): number {
    return this.globalState.money.money;
  }

  get moneyGrowth(): number {
    return this.growthState.money.totalGrowth;
  }

  get availableSynchronization(): number {
    return this.globalState.synchronization.availableValue;
  }

  getCloneCost(cloneTemplateName: CloneTemplateName, tier: number, level: number): number {
    return this.companyState.clones.getCloneCost(cloneTemplateName, tier, level);
  }

  getCloneSynchronization(cloneTemplateName: CloneTemplateName, tier: number): number {
    return this.companyState.clones.getCloneSynchronization(cloneTemplateName, tier);
  }
}
