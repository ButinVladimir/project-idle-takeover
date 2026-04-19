import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { TYPES } from '@state/types';
import { calculateTierMultiplier, calculateTierPower, Milestone } from '@shared/index';
import { IPurchaseCloneArgs } from './interfaces';
import { CloneValidationResult } from './types';
import { IOwnedClonesValidator } from './interfaces';
import { typedCloneTemplates } from '../clone-factory';
import { type IClonesState } from '../../interfaces/clones-state';

const { lazyInject } = decorators;

@injectable()
export class OwnedClonesValidator implements IOwnedClonesValidator {
  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  validateClone(cloneArgs: IPurchaseCloneArgs): CloneValidationResult {
    if (!this._unlockState.milestones.isMilestoneReached(Milestone.unlockedCompanyManagement)) {
      return CloneValidationResult.companyLocked;
    }

    if (
      !this._unlockState.items.cloneTemplates.isItemAvailable(cloneArgs.templateName, cloneArgs.tier, cloneArgs.level)
    ) {
      return CloneValidationResult.cloneNotAvailable;
    }

    if (!cloneArgs.name) {
      return CloneValidationResult.nameEmpty;
    }

    const synchronization = this.calculateCloneSynchronization(cloneArgs.templateName, cloneArgs.tier);
    const availableSynchronization = this.calculateCloneAvailableSynchronization(cloneArgs);

    if (synchronization > availableSynchronization) {
      return CloneValidationResult.notEnoughSynchronization;
    }

    const cost = this.calculateCloneCost(cloneArgs.templateName, cloneArgs.tier, cloneArgs.level);
    if (cost > this._globalState.money.money) {
      return CloneValidationResult.notEnoughMoney;
    }

    return CloneValidationResult.valid;
  }

  calculateCloneCost(templateName: string, tier: number, level: number): number {
    return calculateTierPower(level, tier, typedCloneTemplates[templateName].cost);
  }

  calculateCloneSynchronization(templateName: string, tier: number): number {
    const template = typedCloneTemplates[templateName];

    return Math.ceil(
      template.synchronization.multiplier * calculateTierMultiplier(tier, template.synchronization.baseTier),
    );
  }

  calculateCloneAvailableSynchronization(cloneArgs: IPurchaseCloneArgs): number {
    let availableSynchronization = this._globalState.synchronization.availableValue;

    if (cloneArgs.id) {
      const existingClone = this._clonesState.ownedClones.getCloneById(cloneArgs.id);

      if (!existingClone) {
        throw new Error(`Clone with id ${cloneArgs.id} not found`);
      }

      availableSynchronization += this.calculateCloneSynchronization(existingClone.templateName, existingClone.tier);
    }

    return availableSynchronization;
  }
}
