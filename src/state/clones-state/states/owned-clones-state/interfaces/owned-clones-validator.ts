import { CloneValidationResult } from '../types';
import { IPurchaseCloneArgs } from './purchase-clone-args';

export interface IOwnedClonesValidator {
  validateClone(clone: IPurchaseCloneArgs): CloneValidationResult;
  calculateCloneCost(template: string, tier: number, level: number): number;
  calculateCloneSynchronization(template: string, tier: number): number;
  calculateCloneAvailableSynchronization(clone: IPurchaseCloneArgs): number;
}
