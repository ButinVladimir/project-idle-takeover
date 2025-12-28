import {
  Attribute,
  Skill,
  calculatePower,
  ATTRIBUTES,
  SKILLS,
  DistrictTypeRewardParameter,
  calculateLinear,
} from '@shared/index';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { IContract, IContractArguments, ISerializedContract } from './interfaces';
import { typedContracts } from './constants';

const { lazyInject } = decorators;

export class Contract implements IContract {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  private _templateName: string;
  private _district: IDistrictState;
  private _assignedClones: IClone[];

  constructor(args: IContractArguments) {
    this._templateName = args.contractName;
    this._district = args.district;
    this._assignedClones = args.assignedClones;
  }

  get contractName() {
    return this._templateName;
  }

  get district() {
    return this._district;
  }

  get assignedClones() {
    return this._assignedClones;
  }

  get contractTemplate() {
    return typedContracts[this._templateName];
  }

  get completionTime() {
    return typedContracts[this._templateName].requirements.baseCompletionTime;
  }

  get minRequiredClones() {
    return this.contractTemplate.requirements.teamSize.min;
  }

  get maxRequiredClones() {
    return this.contractTemplate.requirements.teamSize.max;
  }

  getAttributeRequirement(attribute: Attribute): number {
    if (!this.contractTemplate.requirements.attributes[attribute]) {
      return 0;
    }

    return Math.floor(
      this._district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, this.contractTemplate.requirements.attributes[attribute]),
    );
  }

  getAttributeRequiredTeamSize(attribute: Attribute): number {
    if (!this.contractTemplate.requirements.attributes[attribute]) {
      return 0;
    }

    return this.contractTemplate.requirements.attributes[attribute].teamSize;
  }

  getSkillRequirement(skill: Skill): number {
    if (!this.contractTemplate.requirements.skills[skill]) {
      return 0;
    }

    return Math.floor(
      this._district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, this.contractTemplate.requirements.skills[skill]),
    );
  }

  getSkillRequiredTeamSize(skill: Skill): number {
    if (!this.contractTemplate.requirements.skills[skill]) {
      return 0;
    }

    return this.contractTemplate.requirements.skills[skill].teamSize;
  }

  getAttributeModifier(attribute: Attribute): number {
    if (!this.contractTemplate.rewardModifiers.attributes[attribute]) {
      return 1;
    }

    return (
      1 +
      calculatePower(this._globalState.threat.level, this.contractTemplate.rewardModifiers.attributes[attribute]) *
        this.getAttributeSum(attribute)
    );
  }

  getSkillModifier(skill: Skill): number {
    if (!this.contractTemplate.rewardModifiers.skills[skill]) {
      return 1;
    }

    return (
      1 +
      calculatePower(this._globalState.threat.level, this.contractTemplate.rewardModifiers.skills[skill]) *
        this.getSkillSum(skill)
    );
  }

  getParameterVisibility(parameter: DistrictTypeRewardParameter): boolean {
    const contractModifier = this.contractTemplate.rewards[parameter];

    return !!contractModifier;
  }

  calculateParameterDelta(parameter: DistrictTypeRewardParameter): number {
    const contractModifier = this.contractTemplate.rewards[parameter];

    if (!contractModifier) {
      return 0;
    }

    if (!this._unlockState.milestones.isRewardParameterUnlocked(parameter)) {
      return 0;
    }

    const cloneParametersModifier = this.getCloneParametersModifier();
    const rewardsModifier = this._district.parameters.rewards.totalMultiplier;
    const districtTypeModifier = this._district.template.parameters[parameter];

    const baseDelta =
      calculatePower(this._globalState.threat.level, contractModifier) *
      calculateLinear(this._district.parameters.influence.tier, districtTypeModifier.progression) *
      Math.pow(rewardsModifier * cloneParametersModifier, districtTypeModifier.exponent);

    switch (parameter) {
      case DistrictTypeRewardParameter.money:
      case DistrictTypeRewardParameter.developmentPoints:
      case DistrictTypeRewardParameter.experience:
      case DistrictTypeRewardParameter.influence:
      case DistrictTypeRewardParameter.connectivity:
      case DistrictTypeRewardParameter.codeBase:
      case DistrictTypeRewardParameter.computationalBase:
      case DistrictTypeRewardParameter.rewards:
        return baseDelta;
      default:
        return 0;
    }
  }

  serialize(): ISerializedContract {
    return {
      contractName: this._templateName,
      districtIndex: this._district.index,
      assignedCloneIds: this._assignedClones.map((clone) => clone.id),
    };
  }

  private getCloneParametersModifier(): number {
    let modifier = 1;

    for (const attribute of ATTRIBUTES) {
      modifier *= this.getAttributeModifier(attribute);
    }

    for (const skill of SKILLS) {
      modifier *= this.getSkillModifier(skill);
    }

    return modifier;
  }

  private getAttributeSum(attribute: Attribute): number {
    return this._assignedClones.reduce((sum, clone) => sum + clone.getTotalAttributeValue(attribute), 0);
  }

  private getSkillSum(skill: Skill): number {
    return this._assignedClones.reduce((sum, clone) => sum + clone.getTotalSkillValue(skill), 0);
  }
}
