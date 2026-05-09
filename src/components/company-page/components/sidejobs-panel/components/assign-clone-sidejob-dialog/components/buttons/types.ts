import { SidejobsBatchValidationResult } from '@state/activity-state';

export enum AssignCloneSidejobDialogFormWarning {
  notSelected = 'notSelected',
  alreadyAssigned = 'alreadyAssigned',
}

export type AssignCloneSidejobDialogWarning = AssignCloneSidejobDialogFormWarning | SidejobsBatchValidationResult;
