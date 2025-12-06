import { ContractValidationResult } from '@state/activity-state';

export enum AssignClonesContractDialogFormWarning {
  notSelected = 'notSelected',
  alreadyAssigned = 'alreadyAssigned',
}

export type AssignClonesContractDialogWarning = AssignClonesContractDialogFormWarning | ContractValidationResult;
