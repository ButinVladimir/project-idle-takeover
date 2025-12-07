import { msg } from '@lit/localize';
import { ContractValidationResult, SidejobValidationResult } from '@state/activity-state';
import { CompanyPageTabs } from './types';

export const COMPANY_PAGE_TABS_LIST = Array.from(Object.values(CompanyPageTabs));

export const COMPANY_PAGE_TAB_TITLES: Record<CompanyPageTabs, () => string> = {
  [CompanyPageTabs.clones]: () => msg('Clones'),
  [CompanyPageTabs.sidejobs]: () => msg('Sidejobs'),
  [CompanyPageTabs.contractAssignments]: () => msg('Contracts assignments'),
};

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
  [ContractValidationResult.noContractsAvailable]: () => msg('No available contracts'),
  [ContractValidationResult.valid]: () => msg('Sidejob is valid'),
};
