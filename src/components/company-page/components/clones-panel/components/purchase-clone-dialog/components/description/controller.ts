import { BaseController } from '@shared/base-controller';
import { CloneTemplateName } from '@state/company-state/states/clone-factory/types';

export class PurchaseCloneDialogDescriptionTextController extends BaseController {
  get availableSynchronization(): number {
    return this.globalState.synchronization.availableValue;
  }

  getCloneSynchronization(cloneTemplateName: CloneTemplateName, tier: number): number {
    return this.companyState.clones.getCloneSynchronization(cloneTemplateName, tier);
  }

  get money(): number {
    return this.globalState.money.money;
  }

  getCloneCost(cloneTemplateName: CloneTemplateName, tier: number, level: number): number {
    return this.companyState.clones.getCloneCost(cloneTemplateName, tier, level);
  }
}
