import { Attribute, Skill } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { SidejobsBatchValidationResult, SidejobValidationResult } from '../types';

export interface ISidejobActivityValidator {
  getConnectivityRequirement(sidejobName: string): number;
  getAttributeRequirement(sidejobName: string, district: IDistrictState, attribute: Attribute): number;
  getSkillRequirement(sidejobName: string, district: IDistrictState, skill: Skill): number;
  validateSidejob(sidejobName: string, district: IDistrictState, clone: IClone): SidejobValidationResult;
  validateSidejobsBatch(sidejobName: string, district: IDistrictState, clones: IClone[]): SidejobsBatchValidationResult;
  validateAttribute(sidejobName: string, district: IDistrictState, clone: IClone, attribute: Attribute): boolean;
  validateSkill(sidejobName: string, district: IDistrictState, clone: IClone, skill: Skill): boolean;
}
