import { msg } from '@lit/localize';
import {
  ProgramsBatchValidationResult,
  ProgramValidationResult,
} from '@state/mainframe-state/states/mainframe-programs-state/types';
import { SidejobsBatchValidationResult, SidejobValidationResult } from '@state/activity-state/states/sidejob-activity-validator/types';
import { ContractValidationResult } from '@state/activity-state/states/contract-activity-validator/types';
import { MainframeHardwareValidationResult } from '@state/mainframe-state/states/mainframe-hardware-state/types';
import {
  ProcessesBatchValidationResult,
  ProcessValidationResult,
} from '@state/mainframe-state/states/mainframe-processes-state/types';
import { CloneValidationResult } from '@state/clones-state/states/owned-clones-state/types';
import { COMMON_TEXTS } from './common';

export const SIDEJOB_VALIDATION_TEXTS: Record<SidejobValidationResult, () => string> = {
  [SidejobValidationResult.sidejobNotAvailable]: () => msg('Sidejob is not available'),
  [SidejobValidationResult.districtLocked]: () => msg('District is locked'),
  [SidejobValidationResult.requirementsNotMet]: () => msg(`Clone doesn't fit requirements`),
  [SidejobValidationResult.notEnoughConnectivity]: () => msg('Not enough connectivity'),
  [SidejobValidationResult.valid]: () => msg('Sidejob is valid'),
};

export const SIDEJOBS_BATCH_VALIDATION_TEXTS: Record<SidejobsBatchValidationResult, () => string> = {
  [SidejobsBatchValidationResult.companyLocked]: () => msg('Company is locked'),
  [SidejobsBatchValidationResult.sidejobsNotAvailable]: () => msg('Sine sidejobs are not available'),
  [SidejobsBatchValidationResult.districtsLocked]: () => msg('Some districts are locked'),
  [SidejobsBatchValidationResult.requirementsNotMet]: () => msg(`Some clones don't fit requirements`),
  [SidejobsBatchValidationResult.notEnoughConnectivity]: () => msg('Some districts are lacking connectivity for sidejobs'),
  [SidejobsBatchValidationResult.valid]: () => msg('Sidejobs are valid'),
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
  [ProgramValidationResult.programNotAvailable]: () => msg('Program is not available'),
  [ProgramValidationResult.valid]: () => msg('Program is valid'),
};

export const PROGRAMS_BATCH_VALIDATION_TEXTS: Record<ProgramsBatchValidationResult, () => string> = {
  [ProgramsBatchValidationResult.programsLocked]: () => msg('Some programs are locked'),
  [ProgramsBatchValidationResult.programsNotAvailable]: () => msg('Some programs are not available'),
  [ProgramsBatchValidationResult.notEnoughMoney]: COMMON_TEXTS.notEnoughMoney,
  [ProgramsBatchValidationResult.valid]: () => msg('Programs are valid'),
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
  [ProcessValidationResult.valid]: () => msg('Process is valid'),
};

export const PROCESSES_BATCH_VALIDATION_TEXTS: Record<ProcessesBatchValidationResult, () => string> = {
  [ProcessesBatchValidationResult.programsNotOwned]: () => msg('Some programs are not owned'),
  [ProcessesBatchValidationResult.notEnoughRam]: () => msg('Not enough RAM'),
  [ProcessesBatchValidationResult.threadsInvalid]: () => msg('Invalid amount of threads'),
  [ProcessesBatchValidationResult.multipleScalableProcesses]: () =>
    msg('Multiple autoscalable processes cannot be started at same time'),
  [ProcessesBatchValidationResult.valid]: () => msg('Processes are valid'),
};

export const CLONE_VALIDATION_TEXTS: Record<CloneValidationResult, () => string> = {
  [CloneValidationResult.companyLocked]: () => msg('Company is locked'),
  [CloneValidationResult.cloneNotAvailable]: () => msg('Clone is not available'),
  [CloneValidationResult.nameEmpty]: () => msg('Enter clone name'),
  [CloneValidationResult.notEnoughMoney]: COMMON_TEXTS.notEnoughMoney,
  [CloneValidationResult.notEnoughSynchronization]: () => msg('Not enough synchronization'),
  [CloneValidationResult.valid]: () => msg('Clone is valid'),
};
