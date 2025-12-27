import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IUnlockState } from '@state/unlock-state';
import { Attribute, ATTRIBUTES, Skill, SKILLS } from '@shared/index';
import { DistrictUnlockState } from '@state/city-state';
import { IContractActivityValidator } from './interfaces';
import { ContractValidationResult } from './types';
import { IContract } from '../contracts-factory';

const { lazyInject } = decorators;

@injectable()
export class ContractActivityValidator implements IContractActivityValidator {
  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  validate(contract: IContract): ContractValidationResult {
    if (!this._unlockState.activities.contracts.isActivityAvailable(contract.contractName)) {
      return ContractValidationResult.activityLocked;
    }

    if (contract.district.state === DistrictUnlockState.locked) {
      return ContractValidationResult.districtLocked;
    }

    if (contract.assignedClones.length < contract.minRequiredClones) {
      return ContractValidationResult.notEnoughClones;
    }

    if (contract.assignedClones.length > contract.maxRequiredClones) {
      return ContractValidationResult.tooManyClones;
    }

    if (!this.checkRequirements(contract)) {
      return ContractValidationResult.requirementsNotMet;
    }

    return ContractValidationResult.valid;
  }

  validateAttribute(contract: IContract, attribute: Attribute): boolean {
    const requiredTeamSize = contract.getAttributeRequiredTeamSize(attribute);
    const passedClonesCount = this.getAttributeValidTeamSize(contract, attribute);

    return passedClonesCount >= requiredTeamSize;
  }

  validateSkill(contract: IContract, skill: Skill): boolean {
    const requiredTeamSize = contract.getSkillRequiredTeamSize(skill);
    const passedClonesCount = this.getSkillValidTeamSize(contract, skill);

    return passedClonesCount >= requiredTeamSize;
  }

  getAttributeValidTeamSize(contract: IContract, attribute: Attribute): number {
    const requiredValue = contract.getAttributeRequirement(attribute);

    return contract.assignedClones.reduce(
      (sum, clone) => (clone.getTotalAttributeValue(attribute) >= requiredValue ? sum + 1 : sum),
      0,
    );
  }

  getSkillValidTeamSize(contract: IContract, skill: Skill): number {
    const requiredValue = contract.getSkillRequirement(skill);

    return contract.assignedClones.reduce(
      (sum, clone) => (clone.getTotalSkillValue(skill) >= requiredValue ? sum + 1 : sum),
      0,
    );
  }

  private checkRequirements(contract: IContract): boolean {
    for (const attribute of ATTRIBUTES) {
      if (!this.validateAttribute(contract, attribute)) {
        return false;
      }
    }

    for (const skill of SKILLS) {
      if (!this.validateSkill(contract, skill)) {
        return false;
      }
    }

    return true;
  }
}
