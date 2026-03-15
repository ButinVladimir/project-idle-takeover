import { ProcessValidationResult } from '@state/mainframe-state';

export enum StartProcessDialogFormWarning {
  notSelected = 'notSelected',
  alreadyRunningSame = 'alreadyRunningSame',
  alreadyRunningSameAutoscalable = 'alreadyRunningSameAutoscalable',
  alreadyRunningAutoscalable = 'alreadyRunningAutoscalable',
}

export type StartProcessDialogWarning = StartProcessDialogFormWarning | ProcessValidationResult;
