import { Attribute, Skill, DistrictTypeRewardParameter } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { ISerializedContract } from './serialized-contract';
import { IContractTemplate } from './contract-template';

export interface IContract {
  contractName: string;
  district: IDistrictState;
  assignedClones: IClone[];
  contractTemplate: IContractTemplate;
  completionTime: number;
  minRequiredClones: number;
  maxRequiredClones: number;
  getAttributeRequirement(attribute: Attribute): number;
  getAttributeRequiredTeamSize(attribute: Attribute): number;
  getSkillRequirement(skill: Skill): number;
  getSkillRequiredTeamSize(skill: Skill): number;
  getAttributeModifier(attribute: Attribute): number;
  getSkillModifier(skill: Skill): number;
  calculateParameterDelta(parameter: DistrictTypeRewardParameter): number;
  serialize(): ISerializedContract;
}
