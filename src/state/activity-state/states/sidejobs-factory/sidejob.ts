import { Attribute, Skill, calculatePower, ATTRIBUTES, SKILLS, DistrictTypeRewardParameter } from '@shared/index';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { ISerializedSidejob, ISidejob, ISidejobArguments } from './interfaces';
import { typedSidejobs } from './constants';

const { lazyInject } = decorators;

export class Sidejob implements ISidejob {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  private _templateName: string;
  private _district: IDistrictState;
  private _assignedClone: IClone;

  constructor(args: ISidejobArguments) {
    this._templateName = args.sidejobName;
    this._district = args.district;
    this._assignedClone = args.assignedClone;
  }

  get sidejobName() {
    return this._templateName;
  }

  get district() {
    return this._district;
  }

  get assignedClone() {
    return this._assignedClone;
  }

  get sidejobTemplate() {
    return typedSidejobs[this._templateName];
  }

  getAttributeRequirement(attribute: Attribute): number {
    if (!this.sidejobTemplate.requirements.attributes[attribute]) {
      return 0;
    }

    return Math.floor(
      this._district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, this.sidejobTemplate.requirements.attributes[attribute]),
    );
  }

  getSkillRequirement(skill: Skill): number {
    if (!this.sidejobTemplate.requirements.skills[skill]) {
      return 0;
    }

    return Math.floor(
      this._district.template.activityRequirementModifier *
        calculatePower(this._globalState.threat.level, this.sidejobTemplate.requirements.skills[skill]),
    );
  }

  getAttributeModifier(attribute: Attribute): number {
    if (!this.sidejobTemplate.rewardModifiers.attributes[attribute]) {
      return 1;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewardModifiers.attributes[attribute]) *
      this._assignedClone.getTotalAttributeValue(attribute)
    );
  }

  getSkillModifier(skill: Skill): number {
    if (!this.sidejobTemplate.rewardModifiers.skills[skill]) {
      return 1;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewardModifiers.skills[skill]) *
      this._assignedClone.getTotalSkillValue(skill)
    );
  }

  getParameterVisibility(parameter: DistrictTypeRewardParameter): boolean {
    const sidejobModifier = this.sidejobTemplate.rewards[parameter];

    return !!sidejobModifier;
  }

  calculateParameterDelta(parameter: DistrictTypeRewardParameter, passedTime: number): number {
    const sidejobModifier = this.sidejobTemplate.rewards[parameter];

    if (!sidejobModifier) {
      return 0;
    }

    if (!this._unlockState.milestones.isRewardParameterUnlocked(parameter)) {
      return 0;
    }

    const cloneParametersModifier = this.getCloneParametersModifier();
    const rewardsModifier = this._district.parameters.rewards.totalMultiplier;
    const districtTypeModifier = this._district.template.parameters[parameter];

    const baseDelta = Math.pow(
      rewardsModifier *
        cloneParametersModifier *
        calculatePower(this._globalState.threat.level, sidejobModifier) *
        calculatePower(this._district.parameters.influence.tier, districtTypeModifier.progression),
      districtTypeModifier.exponent,
    );

    switch (parameter) {
      case DistrictTypeRewardParameter.money:
      case DistrictTypeRewardParameter.developmentPoints:
      case DistrictTypeRewardParameter.experience:
      case DistrictTypeRewardParameter.influence:
      case DistrictTypeRewardParameter.connectivity:
      case DistrictTypeRewardParameter.codeBase:
      case DistrictTypeRewardParameter.computationalBase:
      case DistrictTypeRewardParameter.rewards:
        return passedTime * baseDelta;
      case DistrictTypeRewardParameter.processCompletionSpeed:
      case DistrictTypeRewardParameter.experienceShareMultiplier:
        return baseDelta;
    }
  }

  serialize(): ISerializedSidejob {
    return {
      sidejobName: this._templateName,
      districtIndex: this._district.index,
      assignedCloneId: this._assignedClone.id,
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
}
