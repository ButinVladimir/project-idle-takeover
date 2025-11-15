import { Attribute, Skill } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { IMakeSidejobParameters } from './make-sidejob-parameters';
import { ISidejobTemplate } from './sidejob-template';

export interface ISidejob {
  id: string;
  sidejobName: string;
  district: IDistrictState;
  isActive: boolean;
  assignedClone?: IClone;
  sidejobTemplate: ISidejobTemplate;
  checkRequirements(): boolean;
  getAttributeRequirement(attribute: Attribute): number;
  getSkillRequirement(skill: Skill): number;
  getAttributeModifier(attribute: Attribute): number;
  getSkillModifier(skill: Skill): number;
  perform(): void;
  calculateExperienceDelta(passedTime: number): number;
  calculateMoneyDelta(passedTime: number): number;
  calculateDevelopmentPointsDelta(passedTime: number): number;
  calculateInfluenceDelta(passedTime: number): number;
  calculateConnectivityDelta(passedTime: number): number;
  calculateCodeBaseDelta(passedTime: number): number;
  calculateComputationalBaseDelta(passedTime: number): number;
  calculateRewardsDelta(passedTime: number): number;
  calculateProcessCompletionSpeedDelta(): number;
  calculateExperienceShareMultiplierDelta(): number;
  handlePerformanceUpdate(): void;
  serialize(): IMakeSidejobParameters;
  removeAllEventListeners(): void;
}
