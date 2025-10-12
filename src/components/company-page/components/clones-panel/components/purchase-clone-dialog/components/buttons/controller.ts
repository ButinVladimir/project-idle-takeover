import { BaseController } from '@shared/index';

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

  getCloneCost(cloneTemplateName: string, tier: number, level: number): number {
    return this.companyState.clones.calculateCloneCost(cloneTemplateName, tier, level);
  }

  getCloneSynchronization(cloneTemplateName: string, tier: number): number {
    return this.companyState.clones.calculateCloneSynchronization(cloneTemplateName, tier);
  }
}
