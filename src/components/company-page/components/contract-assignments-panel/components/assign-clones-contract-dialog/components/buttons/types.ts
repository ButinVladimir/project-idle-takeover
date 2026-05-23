import { ContractsBatchValidationResult } from '@state/activity-state';

export enum AssignClonesContractsDialogFormWarning {
  notSelected = 'notSelected',
  alreadyAssigned = 'alreadyAssigned',
}

export type AssignClonesContractDialogWarning = AssignClonesContractsDialogFormWarning | ContractsBatchValidationResult;
