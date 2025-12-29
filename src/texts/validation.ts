import { msg } from '@lit/localize';
import { ContractValidationResult, SidejobValidationResult } from '@state/activity-state';

export const SIDEJOB_VALIDATION_TEXTS: Record<SidejobValidationResult, () => string> = {
  [SidejobValidationResult.activityLocked]: () => msg('Sidejob is locked'),
  [SidejobValidationResult.districtLocked]: () => msg('District is locked'),
  [SidejobValidationResult.requirementsNotMet]: () => msg(`Clone doesn't fit requirements`),
  [SidejobValidationResult.notEnoughConnectivity]: () => msg('Not enough connectivity'),
  [SidejobValidationResult.valid]: () => msg('Sidejob is valid'),
};

export const CONTRACT_VALIDATION_TEXTS: Record<ContractValidationResult, () => string> = {
  [ContractValidationResult.activityLocked]: () => msg('Sidejob is locked'),
  [ContractValidationResult.districtLocked]: () => msg('District is locked'),
  [ContractValidationResult.requirementsNotMet]: () => msg(`Clones don't fit requirements`),
  [ContractValidationResult.notEnoughClones]: () => msg('Not enough clones'),
  [ContractValidationResult.tooManyClones]: () => msg('Too many clones'),
  [ContractValidationResult.valid]: () => msg('Contract is valid'),
};
