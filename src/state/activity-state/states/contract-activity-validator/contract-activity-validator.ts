import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IUnlockState } from '@state/unlock-state';
import { type IGlobalState } from '@state/global-state';
import { Attribute, ATTRIBUTES, calculatePower, Milestone, Skill, SKILLS } from '@shared/index';
import { DistrictUnlockState, IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { IContractActivityValidator } from './interfaces';
import { ContractsBatchValidationResult, ContractValidationResult } from './types';
import { typedContracts } from '../contracts-factory';

const { lazyInject } = decorators;

@injectable()
export class ContractActivityValidator implements IContractActivityValidator {
  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  validateContract(contractName: string, district: IDistrictState, clones: IClone[]): ContractValidationResult {
    if (!this._unlockState.milestones.isMilestoneReached(Milestone.unlockedPrimaryActivity)) {
      return ContractValidationResult.primaryActivityLocked;
    }

    if (!this._unlockState.activities.contracts.isActivityAvailable(contractName)) {
      return ContractValidationResult.contractNotAvailable;
    }

    if (district.state === DistrictUnlockState.locked) {
      return ContractValidationResult.districtLocked;
    }

    if (clones.length < this.getMinTeamSize(contractName)) {
      return ContractValidationResult.notEnoughClones;
    }

    if (clones.length > this.getMaxTeamSize(contractName)) {
      return ContractValidationResult.tooManyClones;
    }

    if (!this.checkRequirements(contractName, district, clones)) {
      return ContractValidationResult.requirementsNotMet;
    }

    return ContractValidationResult.valid;
  }

  validateContractsBatch(
    contractNames: string[],
    districts: IDistrictState[],
    clones: IClone[],
  ): ContractsBatchValidationResult {
    const errors = new Set<ContractValidationResult>();

    for (const contractName of contractNames) {
      for (const district of districts) {
        errors.add(this.validateContract(contractName, district, clones));
      }
    }

    if (errors.has(ContractValidationResult.primaryActivityLocked)) {
      return ContractsBatchValidationResult.primaryActivityLocked;
    }

    if (errors.has(ContractValidationResult.contractNotAvailable)) {
      return ContractsBatchValidationResult.contractNotAvailable;
    }

    if (errors.has(ContractValidationResult.districtLocked)) {
      return ContractsBatchValidationResult.districtsLocked;
    }

    if (errors.has(ContractValidationResult.notEnoughClones)) {
      return ContractsBatchValidationResult.notEnoughClones;
    }

    if (errors.has(ContractValidationResult.tooManyClones)) {
      return ContractsBatchValidationResult.tooManyClones;
    }

    if (errors.has(ContractValidationResult.requirementsNotMet)) {
      return ContractsBatchValidationResult.requirementsNotMet;
    }

    return ContractsBatchValidationResult.valid;
  }

  validateAttribute(contractName: string, district: IDistrictState, clones: IClone[], attribute: Attribute): boolean {
    const requiredTeamSize = this.getAttributeRequiredTeamSize(contractName, attribute);
    const passedClonesCount = this.getAttributeValidTeamSize(contractName, district, clones, attribute);

    return passedClonesCount >= requiredTeamSize;
  }

  validateSkill(contractName: string, district: IDistrictState, clones: IClone[], skill: Skill): boolean {
    const requiredTeamSize = this.getSkillRequiredTeamSize(contractName, skill);
    const passedClonesCount = this.getSkillValidTeamSize(contractName, district, clones, skill);

    return passedClonesCount >= requiredTeamSize;
  }

  getAttributeRequirement(contractName: string, district: IDistrictState, attribute: Attribute): number {
    if (!typedContracts[contractName].requirements.attributes[attribute]) {
      return 0;
    }

    return Math.floor(
      district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, typedContracts[contractName].requirements.attributes[attribute]),
    );
  }

  getAttributeRequiredTeamSize(contractName: string, attribute: Attribute): number {
    if (!typedContracts[contractName].requirements.attributes[attribute]) {
      return 0;
    }

    return typedContracts[contractName].requirements.attributes[attribute].teamSize;
  }

  getAttributeValidTeamSize(
    contractName: string,
    district: IDistrictState,
    clones: IClone[],
    attribute: Attribute,
  ): number {
    const requiredValue = this.getAttributeRequirement(contractName, district, attribute);
    let sum = 0;

    for (const clone of clones) {
      if (clone.getTotalAttributeValue(attribute) >= requiredValue) {
        sum++;
      }
    }

    return sum;
  }

  getSkillRequirement(contractName: string, district: IDistrictState, skill: Skill): number {
    if (!typedContracts[contractName].requirements.skills[skill]) {
      return 0;
    }

    return Math.floor(
      district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, typedContracts[contractName].requirements.skills[skill]),
    );
  }

  getSkillRequiredTeamSize(contractName: string, skill: Skill): number {
    if (!typedContracts[contractName].requirements.skills[skill]) {
      return 0;
    }

    return typedContracts[contractName].requirements.skills[skill].teamSize;
  }

  getSkillValidTeamSize(contractName: string, district: IDistrictState, clones: IClone[], skill: Skill): number {
    const requiredValue = this.getSkillRequirement(contractName, district, skill);
    let sum = 0;

    for (const clone of clones) {
      if (clone.getTotalSkillValue(skill) >= requiredValue) {
        sum++;
      }
    }

    return sum;
  }

  getMinTeamSize(contractName: string): number {
    return typedContracts[contractName].requirements.teamSize.min;
  }

  getMaxTeamSize(contractName: string): number {
    return typedContracts[contractName].requirements.teamSize.max;
  }

  private checkRequirements(contractName: string, district: IDistrictState, clones: IClone[]): boolean {
    for (const attribute of ATTRIBUTES) {
      if (!this.validateAttribute(contractName, district, clones, attribute)) {
        return false;
      }
    }

    for (const skill of SKILLS) {
      if (!this.validateSkill(contractName, district, clones, skill)) {
        return false;
      }
    }

    return true;
  }
}
