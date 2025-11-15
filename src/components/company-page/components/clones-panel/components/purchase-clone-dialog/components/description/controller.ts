import { BaseController } from '@shared/index';

export class PurchaseCloneDialogDescriptionTextController extends BaseController {
  get availableSynchronization(): number {
    return this.globalState.synchronization.availableValue;
  }

  getCloneSynchronization(cloneTemplateName: string, tier: number): number {
    return this.clonesState.ownedClones.calculateCloneSynchronization(cloneTemplateName, tier);
  }

  get money(): number {
    return this.globalState.money.money;
  }

  getCloneCost(cloneTemplateName: string, tier: number, level: number): number {
    return this.clonesState.ownedClones.calculateCloneCost(cloneTemplateName, tier, level);
  }
}
