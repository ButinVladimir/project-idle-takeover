import { IPurchaseCloneArgs, IClone, CloneValidationResult } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class PurchaseCloneDialogController extends BaseController {
  get developmentLevel(): number {
    return this.globalState.development.level;
  }

  getHighestAvailableTier(cloneTemplateName: string): number {
    return this.unlockState.items.cloneTemplates.getItemHighestAvailableTier(cloneTemplateName);
  }

  listAvailableCloneTemplates(): string[] {
    return this.unlockState.items.cloneTemplates.listAvailableItems();
  }

  purchaseClone(args: IPurchaseCloneArgs): boolean {
    return this.clonesState.ownedClones.purchaseClone(args);
  }

  generateName(): string {
    return this.clonesState.ownedClones.generateCloneName();
  }

  validateClone(clone: IClone): boolean {
    return this.clonesState.ownedClones.validator.validateClone(clone) === CloneValidationResult.valid;
  }

  getClone(id: string, name: string, cloneTemplateName: string, tier: number, level: number): IClone {
    return this.clonesState.cloneFactory.makeClone({
      id,
      name,
      templateName: cloneTemplateName,
      tier,
      level,
      experience: 0,
      autoUpgradeEnabled: true,
    });
  }
}
