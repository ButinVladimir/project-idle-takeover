import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { Attribute, ATTRIBUTES, calculatePower, Milestone, Skill, SKILLS } from '@shared/index';
import { DistrictUnlockState, IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { typedSidejobs } from '../sidejobs-factory';
import { ISidejobActivityValidator } from './interfaces';
import { SidejobsBatchValidationResult, SidejobValidationResult } from './types';

const { lazyInject } = decorators;

@injectable()
export class SidejobActivityValidator implements ISidejobActivityValidator {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  getConnectivityRequirement(sidejobName: string): number {
    return calculatePower(this._globalState.threat.level, typedSidejobs[sidejobName].requirements.connectivity);
  }

  getAttributeRequirement(sidejobName: string, district: IDistrictState, attribute: Attribute): number {
    const template = typedSidejobs[sidejobName];

    if (!template.requirements.attributes[attribute]) {
      return 0;
    }

    return Math.floor(
      district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, template.requirements.attributes[attribute]),
    );
  }

  getSkillRequirement(sidejobName: string, district: IDistrictState, skill: Skill): number {
    const template = typedSidejobs[sidejobName];

    if (!template.requirements.skills[skill]) {
      return 0;
    }

    return Math.floor(
      district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, template.requirements.skills[skill]),
    );
  }

  validateSidejob(sidejobName: string, district: IDistrictState, clone: IClone): SidejobValidationResult {
    if (!this._unlockState.activities.sidejobs.isActivityAvailable(sidejobName)) {
      return SidejobValidationResult.sidejobNotAvailable;
    }

    if (district.state === DistrictUnlockState.locked) {
      return SidejobValidationResult.districtLocked;
    }

    const requiredConnectivity = this.getConnectivityRequirement(sidejobName);

    if (requiredConnectivity > district.parameters.connectivity.totalValue) {
      return SidejobValidationResult.notEnoughConnectivity;
    }

    if (!this.checkRequirements(sidejobName, district, clone)) {
      return SidejobValidationResult.requirementsNotMet;
    }

    return SidejobValidationResult.valid;
  }

  validateSidejobsBatch(
    sidejobName: string,
    district: IDistrictState,
    clones: IClone[],
  ): SidejobsBatchValidationResult {
    if (!this._unlockState.milestones.isMilestoneReached(Milestone.unlockedCompanyManagement)) {
      return SidejobsBatchValidationResult.companyLocked;
    }

    const sidejobValidationResults = clones.map((clone) => this.validateSidejob(sidejobName, district, clone));

    if (sidejobValidationResults.includes(SidejobValidationResult.sidejobNotAvailable)) {
      return SidejobsBatchValidationResult.sidejobsNotAvailable;
    }

    if (sidejobValidationResults.includes(SidejobValidationResult.districtLocked)) {
      return SidejobsBatchValidationResult.districtsLocked;
    }

    if (sidejobValidationResults.includes(SidejobValidationResult.notEnoughConnectivity)) {
      return SidejobsBatchValidationResult.notEnoughConnectivity;
    }

    if (sidejobValidationResults.includes(SidejobValidationResult.requirementsNotMet)) {
      return SidejobsBatchValidationResult.requirementsNotMet;
    }

    return SidejobsBatchValidationResult.valid;
  }

  validateAttribute(sidejobName: string, district: IDistrictState, clone: IClone, attribute: Attribute): boolean {
    return clone.getTotalAttributeValue(attribute) >= this.getAttributeRequirement(sidejobName, district, attribute);
  }

  validateSkill(sidejobName: string, district: IDistrictState, clone: IClone, skill: Skill): boolean {
    return clone.getTotalSkillValue(skill) >= this.getSkillRequirement(sidejobName, district, skill);
  }

  private checkRequirements(sidejobName: string, district: IDistrictState, clone: IClone): boolean {
    for (const attribute of ATTRIBUTES) {
      if (!this.validateAttribute(sidejobName, district, clone, attribute)) {
        return false;
      }
    }

    for (const skill of SKILLS) {
      if (!this.validateSkill(sidejobName, district, clone, skill)) {
        return false;
      }
    }

    return true;
  }
}
