import { Attribute, Skill } from '@shared/index';
import { ISidejob } from '../../sidejobs-factory';
import { SidejobValidationResult } from '../types';

export interface ISidejobActivityValidator {
  getConnectivityRequirement(sidejobName: string): number;
  validate(sidejob: ISidejob): SidejobValidationResult;
  validateAttribute(sidejob: ISidejob, attribute: Attribute): boolean;
  validateSkill(sidejob: ISidejob, skill: Skill): boolean;
}
