import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { binarySearchDecimal, Feature, PurchaseType } from '@shared/index';
import { type IGlobalState } from '@state/global-state';
import { type IAutomationState } from '@state/automation-state';
import { ICompanyClonesLevelUpgrader } from './interfaces';
import { type ICompanyState } from '../../interfaces';
import { IClone } from '../clone-factory';

const { lazyInject } = decorators;

export class CompanyClonesLevelUpgrader implements ICompanyClonesLevelUpgrader {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

  private _availableMoney = 0;

  private _availableActions = 0;

  upgradeMaxAllClones(): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = this._globalState.development.level * this._companyState.clones.listClones().length;

    this.performUpgradeAll();
  }

  upgradeMaxClone(id: string): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    const clone = this._companyState.clones.getCloneById(id);

    if (!clone) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = this._globalState.development.level;

    this.performUpgradeClone(clone);
  }

  autoupgrade(actionCount: number): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = (this._globalState.money.money * this._automationState.cloneLevel.moneyShare) / 100;
    this._availableActions = actionCount;

    this.performUpgradeAll();
  }

  private checkUpgradeAvailable() {
    return this._globalState.unlockedFeatures.isFeatureUnlocked(Feature.companyManagement);
  }

  private performUpgradeAll() {
    for (const clone of this._companyState.clones.listClones()) {
      if (this._availableActions <= 0) {
        break;
      }

      if (!clone.autoUpgradeEnabled) {
        continue;
      }

      this.performUpgradeClone(clone);
    }
  }

  private performUpgradeClone(clone: IClone) {
    const checkClone = this.makeCheckCloneFunction(clone);

    const maxLevel = Math.min(this._globalState.development.level, clone.level + this._availableActions);

    const oldLevel = clone.level;
    const newLevel = binarySearchDecimal(oldLevel, maxLevel, checkClone);

    if (newLevel > oldLevel) {
      const cost = this._companyState.clones.getCloneCost(clone.templateName, clone.tier, newLevel);

      if (this.purchaseCloneUpgrade(clone, newLevel)) {
        this._availableMoney -= cost;
        this._availableActions -= newLevel - oldLevel;
      }
    }
  }

  private makeCheckCloneFunction =
    (clone: IClone) =>
    (level: number): boolean => {
      if (!this._globalState.availableItems.cloneTemplates.isItemAvailable(clone.templateName, clone.tier)) {
        return false;
      }

      const cost = this._companyState.clones.getCloneCost(clone.templateName, clone.tier, level);

      return cost <= this._availableMoney;
    };

  private purchaseCloneUpgrade(clone: IClone, newLevel: number) {
    const cost = this._companyState.clones.getCloneCost(clone.templateName, clone.tier, newLevel);

    return this._globalState.money.purchase(cost, PurchaseType.clones, () => {
      clone.upgradeLevel(newLevel);
    });
  }
}
