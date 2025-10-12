import { IPurchaseCloneArgs, IClone } from '@state/company-state';
import { BaseController } from '@shared/base-controller';

export class PurchaseCloneDialogController extends BaseController {
  private _clone?: IClone;

  hostDisconnected() {
    super.hostDisconnected();

    this.deleteTemporaryClone();
  }

  get money(): number {
    return this.globalState.money.money;
  }

  get availableSynchronization(): number {
    return this.globalState.synchronization.availableValue;
  }

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
    return this.companyState.clones.purchaseClone(args);
  }

  generateName(): string {
    return this.companyState.clones.generateCloneName();
  }

  getCloneCost(cloneTemplateName: string, tier: number, level: number): number {
    return this.companyState.clones.calculateCloneCost(cloneTemplateName, tier, level);
  }

  getCloneSynchronization(cloneTemplateName: string, tier: number): number {
    return this.companyState.clones.calculateCloneSynchronization(cloneTemplateName, tier);
  }

  isCloneAvailable(cloneTemplate: string, tier: number, level: number): boolean {
    return this.unlockState.items.cloneTemplates.isItemAvailable(cloneTemplate, tier, level);
  }

  getClone(name: string, cloneTemplateName: string, tier: number, level: number): IClone {
    if (
      this._clone?.name !== name ||
      this._clone.templateName !== cloneTemplateName ||
      this._clone.tier !== tier ||
      this._clone.level !== level
    ) {
      this.deleteTemporaryClone();

      this._clone = this.companyState.cloneFactory.makeClone({
        id: 'temporary',
        name,
        templateName: cloneTemplateName,
        tier,
        level,
        experience: 0,
        autoUpgradeEnabled: true,
      });
    }

    return this._clone;
  }

  private deleteTemporaryClone() {
    if (this._clone) {
      this._clone.removeAllEventListeners();
    }
  }
}
