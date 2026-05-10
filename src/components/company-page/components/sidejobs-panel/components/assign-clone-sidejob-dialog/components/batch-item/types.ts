import { SidejobValidationResult } from '@state/activity-state';

export enum AssignCloneSidejobDialogBatchItemFormWarning {
  alreadyAssigned = 'alreadyAssigned',
}

export type AssignCloneSidejobDialogBatchItemWarning =
  | AssignCloneSidejobDialogBatchItemFormWarning
  | SidejobValidationResult;
