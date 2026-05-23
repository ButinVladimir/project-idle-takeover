import { Attribute, Skill } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { ContractsBatchValidationResult, ContractValidationResult } from '../types';

export interface IContractActivityValidator {
  validateContract(contractName: string, district: IDistrictState, clones: IClone[]): ContractValidationResult;
  validateContractsBatch(contractNames: string[], districts: IDistrictState[], clones: IClone[]): ContractsBatchValidationResult;
  validateAttribute(contractName: string, district: IDistrictState, clones: IClone[], attribute: Attribute): boolean;
  validateSkill(contractName: string, district: IDistrictState, clones: IClone[], skill: Skill): boolean;
  getAttributeRequirement(contractName: string, district: IDistrictState, attribute: Attribute): number;
  getAttributeRequiredTeamSize(contractName: string, attribute: Attribute): number;
  getAttributeValidTeamSize(contractName: string, district: IDistrictState, clones: IClone[], attribute: Attribute): number;
  getSkillRequirement(contractName: string, district: IDistrictState, skill: Skill): number;
  getSkillRequiredTeamSize(contractName: string, skill: Skill): number;
  getSkillValidTeamSize(contractName: string, district: IDistrictState, clones: IClone[], skill: Skill): number;
  getMinTeamSize(contractName: string): number;
  getMaxTeamSize(contractName: string): number;
}
