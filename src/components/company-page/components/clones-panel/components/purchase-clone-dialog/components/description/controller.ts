import { IPurchaseCloneArgs } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class PurchaseCloneDialogDescriptionTextController extends BaseController {
  getCloneAvailableSynchronization(cloneArgs: IPurchaseCloneArgs): number {
    return this.clonesState.ownedClones.validator.calculateCloneAvailableSynchronization(cloneArgs);
  }

  getCloneSynchronization(cloneTemplateName: string, tier: number): number {
    return this.clonesState.ownedClones.validator.calculateCloneSynchronization(cloneTemplateName, tier);
  }

  get money(): number {
    return this.globalState.money.money;
  }

  getCloneCost(cloneTemplateName: string, tier: number, level: number): number {
    return this.clonesState.ownedClones.validator.calculateCloneCost(cloneTemplateName, tier, level);
  }
}
