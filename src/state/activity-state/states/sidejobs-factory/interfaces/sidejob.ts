import { Attribute, Skill } from '@shared/index';
import { DistrictTypeRewardParameter, IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { ISerializedSidejob } from './serialized-sidejob';
import { ISidejobTemplate } from './sidejob-template';

export interface ISidejob {
  sidejobName: string;
  district: IDistrictState;
  assignedClone?: IClone;
  sidejobTemplate: ISidejobTemplate;
  requiredConnectivity: number;
  getAttributeRequirement(attribute: Attribute): number;
  getSkillRequirement(skill: Skill): number;
  getAttributeModifier(attribute: Attribute): number;
  getSkillModifier(skill: Skill): number;
  calculateParameterDelta(parameter: DistrictTypeRewardParameter, passedTime: number): number;
  serialize(): ISerializedSidejob;
  removeAllEventListeners(): void;
}
