import { ContractValidationResult } from '@state/activity-state';

export enum AssignClonesContractDialogBatchItemFormWarning {
  alreadyAssigned = 'alreadyAssigned',
}

export type AssignClonesContractDialogBatchItemWarning =
  | AssignClonesContractDialogBatchItemFormWarning
  | ContractValidationResult;
