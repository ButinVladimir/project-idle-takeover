import { SidejobsBatchValidationResult } from '@state/activity-state';

export enum AssignCloneSidejobDialogFormWarning {
  notSelected = 'notSelected',
  willBeAvailableIn = 'willBeAvailableIn',
  alreadyAssigned = 'alreadyAssigned',
}

export type AssignCloneSidejobDialogWarning = AssignCloneSidejobDialogFormWarning | SidejobsBatchValidationResult;
