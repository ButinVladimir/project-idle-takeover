import { msg } from '@lit/localize';
import { ProgramValidationResult } from '@state/mainframe-state/states/mainframe-programs-state/types';
import { SidejobValidationResult } from '@state/activity-state/states/sidejob-activity-validator/types';
import { ContractValidationResult } from '@state/activity-state/states/contract-activity-validator/types';
import { MainframeHardwareValidationResult } from '@state/mainframe-state/states/mainframe-hardware-state/types';
import { ProcessValidationResult } from '@state/mainframe-state/states/mainframe-processes-state/types';
import { COMMON_TEXTS } from './common';

export const SIDEJOB_VALIDATION_TEXTS: Record<SidejobValidationResult, () => string> = {
  [SidejobValidationResult.companyLocked]: () => msg('Company is locked'),
  [SidejobValidationResult.sidejobNotAvailable]: () => msg('Sidejob is not available'),
  [SidejobValidationResult.districtLocked]: () => msg('District is locked'),
  [SidejobValidationResult.requirementsNotMet]: () => msg(`Clone doesn't fit requirements`),
  [SidejobValidationResult.notEnoughConnectivity]: () => msg('Not enough connectivity'),
  [SidejobValidationResult.valid]: () => msg('Sidejob is valid'),
};

export const CONTRACT_VALIDATION_TEXTS: Record<ContractValidationResult, () => string> = {
  [ContractValidationResult.primaryActivityLocked]: () => msg('Primary activity is locked'),
  [ContractValidationResult.contractNotAvailable]: () => msg('Contract is not available'),
  [ContractValidationResult.districtLocked]: () => msg('District is locked'),
  [ContractValidationResult.requirementsNotMet]: () => msg(`Clones don't fit requirements`),
  [ContractValidationResult.notEnoughClones]: () => msg('Not enough clones'),
  [ContractValidationResult.tooManyClones]: () => msg('Too many clones'),
  [ContractValidationResult.valid]: () => msg('Contract is valid'),
};

export const PROGRAM_VALIDATION_TEXTS: Record<ProgramValidationResult, () => string> = {
  [ProgramValidationResult.programsLocked]: () => msg('Programs are locked'),
  [ProgramValidationResult.programNotAvailable]: () => msg('Program is not available'),
  [ProgramValidationResult.notEnoughMoney]: COMMON_TEXTS.notEnoughMoney,
  [ProgramValidationResult.valid]: () => msg('Program is valid'),
};

export const MAINFRAME_HARDWARE_VALIDATION_TEXTS: Record<MainframeHardwareValidationResult, () => string> = {
  [MainframeHardwareValidationResult.hardwareLocked]: () => msg('Mainframe hardware is locked'),
  [MainframeHardwareValidationResult.increaseInvalid]: () => msg('Increase is invalid'),
  [MainframeHardwareValidationResult.higherDevelopmentLevelRequired]: COMMON_TEXTS.higherDevelopmentLevelRequired,
  [MainframeHardwareValidationResult.notEnoughMoney]: COMMON_TEXTS.notEnoughMoney,
  [MainframeHardwareValidationResult.valid]: () => msg('Program is valid'),
};

export const PROCESS_VALIDATION_TEXTS: Record<ProcessValidationResult, () => string> = {
  [ProcessValidationResult.programNotOwned]: () => msg('Selected program is not owned'),
  [ProcessValidationResult.threadsInvalid]: () => msg('Invalid amount of threads'),
  [ProcessValidationResult.notEnoughRam]: () => msg('Not enough RAM'),
  [ProcessValidationResult.valid]: () => msg('Process is valid'),
};
