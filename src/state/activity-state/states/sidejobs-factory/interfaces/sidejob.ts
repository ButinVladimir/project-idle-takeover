import { Attribute, Skill, DistrictTypeRewardParameter } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { ISerializedSidejob } from './serialized-sidejob';
import { ISidejobTemplate } from './sidejob-template';

export interface ISidejob {
  sidejobName: string;
  district: IDistrictState;
  assignedClone: IClone;
  sidejobTemplate: ISidejobTemplate;
  getAttributeRequirement(attribute: Attribute): number;
  getSkillRequirement(skill: Skill): number;
  getAttributeModifier(attribute: Attribute): number;
  getSkillModifier(skill: Skill): number;
  calculateParameterDelta(parameter: DistrictTypeRewardParameter, passedTime: number): number;
  serialize(): ISerializedSidejob;
}
