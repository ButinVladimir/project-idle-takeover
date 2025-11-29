import { ISidejob } from '../../sidejobs-factory';
import { SidejobValidationResult } from '../types';

export interface ISidejobActivityValidator {
  getConnectivityRequirement(sidejobName: string): number;
  validate(sidejob: ISidejob): SidejobValidationResult;
}
