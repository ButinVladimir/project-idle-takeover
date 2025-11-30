import { Attribute, Skill } from '@shared/index';
import { IContract } from '../../contracts-factory';
import { ContractValidationResult } from '../types';

export interface IContractActivityValidator {
  validate(contract: IContract): ContractValidationResult;
  validateAttribute(contract: IContract, attribute: Attribute): boolean;
  validateSkill(contract: IContract, skill: Skill): boolean;
  getAttributeValidTeamSize(contract: IContract, attribute: Attribute): number;
  getSkillValidTeamSize(contract: IContract, skill: Skill): number;
}
