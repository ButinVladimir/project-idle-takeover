import { Attribute, Skill, calculatePower, ATTRIBUTES, SKILLS, IncomeSource } from '@shared/index';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type ISettingsState } from '@state/settings-state';
import { IDistrictState } from '@state/city-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IClone } from '../clone-factory';
import { ISerializedSidejob, ISidejob, ISidejobArguments } from './interfaces';
import { typedSidejobs } from './constants';

const { lazyInject } = decorators;

export class Sidejob implements ISidejob {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _id: string;
  private _templateName: string;
  private _district: IDistrictState;
  private _isActive: boolean;
  private _assignedClone?: IClone;

  constructor(args: ISidejobArguments) {
    this._id = args.id;
    this._templateName = args.sidejobName;
    this._district = args.district;
    this._assignedClone = args.assignedClone;
    this._isActive = false;

    this._stateUIConnector.registerEventEmitter(this, ['_assignedClone', '_isActive']);
  }

  get id() {
    return this._id;
  }

  get sidejobName() {
    return this._templateName;
  }

  get district() {
    return this._district;
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get assignedClone() {
    return this._assignedClone;
  }

  get sidejobTemplate() {
    return typedSidejobs[this._templateName];
  }

  checkRequirements(): boolean {
    if (!this._assignedClone) {
      return false;
    }

    for (const attribute of ATTRIBUTES) {
      if (this._assignedClone.getTotalAttributeValue(attribute) < this.getAttributeRequirement(attribute)) {
        return false;
      }
    }

    for (const skill of SKILLS) {
      if (this._assignedClone.getTotalSkillValue(skill) < this.getSkillRequirement(skill)) {
        return false;
      }
    }

    return true;
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
    if (!this._assignedClone) {
      return 0;
    }

    if (!this.sidejobTemplate.rewardModifiers.attributes[attribute]) {
      return 1;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewardModifiers.attributes[attribute]) *
      this._assignedClone.getTotalAttributeValue(attribute)
    );
  }

  getSkillModifier(skill: Skill): number {
    if (!this._assignedClone) {
      return 0;
    }

    if (!this.sidejobTemplate.rewardModifiers.skills[skill]) {
      return 1;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewardModifiers.skills[skill]) *
      this._assignedClone.getTotalSkillValue(skill)
    );
  }

  perform(): void {
    if (!this._assignedClone || !this._isActive) {
      return;
    }

    const passedTime = this._settingsState.updateInterval;
    const commonModifier = this.getCommonModifier();

    this._assignedClone.increaseExperience(passedTime * this.calculateExperienceModifier(), true);
    this._globalState.money.increase(passedTime * commonModifier * this.calculateMoneyModifier(), IncomeSource.sidejob);
    this._globalState.development.increase(
      passedTime * commonModifier * this.calculateDevelopmentPointsModifier(),
      IncomeSource.sidejob,
    );
    this._district.parameters.influence.increasePoints(passedTime * commonModifier * this.calculateInfluenceModifier());
    this._district.parameters.connectivity.increasePoints(
      passedTime * commonModifier * this.calculateConnectivityModifier(),
    );
    this._district.parameters.multipliers.codeBase.increasePoints(
      passedTime * commonModifier * this.calculateCodeBaseModifier(),
    );
    this._district.parameters.multipliers.computationalBase.increasePoints(
      passedTime * commonModifier * this.calculateComputationalBaseModifier(),
    );
    this._district.parameters.rewards.increasePoints(passedTime * commonModifier * this.calculateRewardsModifier());
  }

  calculateExperienceDelta(passedTime: number): number {
    return passedTime * this.calculateExperienceModifier();
  }

  calculateMoneyDelta(passedTime: number): number {
    return passedTime * this.getCommonModifier() * this.calculateMoneyModifier();
  }

  calculateDevelopmentPointsDelta(passedTime: number): number {
    return passedTime * this.getCommonModifier() * this.calculateDevelopmentPointsModifier();
  }

  calculateInfluenceDelta(passedTime: number): number {
    return passedTime * this.getCommonModifier() * this.calculateInfluenceModifier();
  }

  calculateConnectivityDelta(passedTime: number): number {
    return passedTime * this.getCommonModifier() * this.calculateConnectivityModifier();
  }

  calculateCodeBaseDelta(passedTime: number): number {
    return passedTime * this.getCommonModifier() * this.calculateCodeBaseModifier();
  }

  calculateComputationalBaseDelta(passedTime: number): number {
    return passedTime * this.getCommonModifier() * this.calculateComputationalBaseModifier();
  }

  calculateRewardsDelta(passedTime: number): number {
    return passedTime * this.getCommonModifier() * this.calculateRewardsModifier();
  }

  calculateProcessCompletionSpeedDelta(): number {
    return this.getCloneParametersModifier() * this.calculateProcessCompletionSpeedModifier();
  }

  calculateExperienceShareMultiplierDelta(): number {
    return this.getCloneParametersModifier() * this.calculateExperienceShareMultiplierModifier();
  }

  handlePerformanceUpdate() {
    if (this.sidejobTemplate.rewards.processCompletionSpeed) {
      this._globalState.processCompletionSpeed.requestRecalculation();
    }

    if (this.sidejobTemplate.rewards.experienceShareMultiplier) {
      this._globalState.experienceShare.requestRecalculation();
    }
  }

  serialize(): ISerializedSidejob {
    return {
      id: this._id,
      sidejobName: this._templateName,
      districtIndex: this._district.index,
      assignedCloneId: this._assignedClone?.id,
    };
  }

  removeAllEventListeners(): void {
    this._stateUIConnector.unregisterEventEmitter(this);
  }

  private getCloneParametersModifier(): number {
    let modifier = 0;

    for (const attribute of ATTRIBUTES) {
      modifier += this.getAttributeModifier(attribute);
    }

    for (const skill of SKILLS) {
      modifier += this.getSkillModifier(skill);
    }

    return modifier;
  }

  private getCommonModifier(): number {
    return this.getCloneParametersModifier() * this._district.parameters.rewards.totalMultiplier;
  }

  private calculateExperienceModifier() {
    if (!this.sidejobTemplate.rewards.experience) {
      return 0;
    }

    return (
      this._assignedClone!.experienceMultiplier *
      this._district.parameters.rewards.totalMultiplier *
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.experience) *
      calculatePower(this._district.parameters.influence.tier, this._district.template.parameters.experience)
    );
  }

  private calculateMoneyModifier() {
    if (!this.sidejobTemplate.rewards.money) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.money) *
      calculatePower(this._district.parameters.influence.tier, this._district.template.parameters.money)
    );
  }

  private calculateDevelopmentPointsModifier() {
    if (!this.sidejobTemplate.rewards.developmentPoints) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.developmentPoints) *
      calculatePower(this._district.parameters.influence.tier, this._district.template.parameters.developmentPoints)
    );
  }

  private calculateInfluenceModifier() {
    if (!this.sidejobTemplate.rewards.influence) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.influence) *
      calculatePower(
        this._district.parameters.influence.tier,
        this._district.template.parameters.influence.pointsMultiplier,
      )
    );
  }

  private calculateConnectivityModifier() {
    if (!this.sidejobTemplate.rewards.connectivity) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.connectivity) *
      calculatePower(
        this._district.parameters.influence.tier,
        this._district.template.parameters.connectivity.pointsMultiplier,
      )
    );
  }

  private calculateCodeBaseModifier() {
    if (!this.sidejobTemplate.rewards.codeBase) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.codeBase) *
      calculatePower(
        this._district.parameters.influence.tier,
        this._district.template.parameters.codeBase.pointsMultiplier,
      )
    );
  }

  private calculateComputationalBaseModifier() {
    if (!this.sidejobTemplate.rewards.computationalBase) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.computationalBase) *
      calculatePower(
        this._district.parameters.influence.tier,
        this._district.template.parameters.computationalBase.pointsMultiplier,
      )
    );
  }

  private calculateRewardsModifier() {
    if (!this.sidejobTemplate.rewards.rewards) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.rewards) *
      calculatePower(
        this._district.parameters.influence.tier,
        this._district.template.parameters.rewards.pointsMultiplier,
      )
    );
  }

  private calculateProcessCompletionSpeedModifier() {
    if (!this.sidejobTemplate.rewards.processCompletionSpeed) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.processCompletionSpeed) *
      calculatePower(
        this._district.parameters.influence.tier,
        this._district.template.parameters.processCompletionSpeed,
      )
    );
  }

  private calculateExperienceShareMultiplierModifier() {
    if (!this.sidejobTemplate.rewards.experienceShareMultiplier) {
      return 0;
    }

    return (
      calculatePower(this._globalState.threat.level, this.sidejobTemplate.rewards.experienceShareMultiplier) *
      calculatePower(
        this._district.parameters.influence.tier,
        this._district.template.parameters.experienceShareMultiplier,
      )
    );
  }
}
