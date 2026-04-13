import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { Milestone, PurchaseType, reverseTierPower } from '@shared/index';
import { type IGlobalState } from '@state/global-state';
import { type IAutomationState } from '@state/automation-state';
import { type IUnlockState } from '@state/unlock-state';
import { IOwnedClonesLevelUpgrader } from './interfaces';
import { type IClonesState } from '../../interfaces';
import { IClone, typedCloneTemplates } from '../clone-factory';

const { lazyInject } = decorators;

@injectable()
export class OwnedClonesLevelUpgrader implements IOwnedClonesLevelUpgrader {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  private _availableMoney = 0;

  private _availableActions = 0;

  upgradeMaxClones(ids: string[]): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    const clones = ids.map((id) => this._clonesState.ownedClones.getCloneById(id)).filter((clone) => clone) as IClone[];

    this._availableMoney = this._globalState.money.money;
    this._availableActions = Number.MAX_SAFE_INTEGER;

    this.performUpgradeClones(clones);
  }

  upgradeMaxClone(id: string): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    const clone = this._clonesState.ownedClones.getCloneById(id);

    if (!clone) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = Number.MAX_SAFE_INTEGER;

    this.performUpgradeClone(clone);
  }

  autoupgrade(actionCount: number): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    const clones = this._clonesState.ownedClones.listClones();

    this._availableMoney = (this._globalState.money.money * this._automationState.cloneLevel.moneyShare) / 100;
    this._availableActions = actionCount;

    this.performUpgradeClones(clones);
  }

  calculateCloneLevelFromMoney(templateName: string, tier: number, money: number): number {
    return Math.min(
      reverseTierPower(money, tier, typedCloneTemplates[templateName].cost),
      this._globalState.development.level,
    );
  }

  private checkUpgradeAvailable() {
    return this._unlockState.milestones.isMilestoneReached(Milestone.unlockedCompanyManagement);
  }

  private performUpgradeClones(clones: IClone[]) {
    for (const clone of clones) {
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
    const oldLevel = clone.level;
    const newLevel = Math.min(
      this.calculateCloneLevelFromMoney(clone.templateName, clone.tier, this._availableMoney),
      clone.level + this._availableActions,
    );

    if (newLevel > oldLevel) {
      const cost = this._clonesState.ownedClones.validator.calculateCloneCost(clone.templateName, clone.tier, newLevel);

      if (this.purchaseCloneUpgrade(clone, newLevel)) {
        this._availableMoney -= cost;
        this._availableActions -= newLevel - oldLevel;
      }
    }
  }

  private purchaseCloneUpgrade(clone: IClone, newLevel: number) {
    const cost = this._clonesState.ownedClones.validator.calculateCloneCost(clone.templateName, clone.tier, newLevel);

    return this._globalState.money.purchase(cost, PurchaseType.clones, () => {
      clone.upgradeLevel(newLevel);
    });
  }
}
