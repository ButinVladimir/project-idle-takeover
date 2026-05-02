import { ProcessesBatchValidationResult } from '@state/mainframe-state';

export enum StartProcessDialogFormWarning {
  notSelected = 'notSelected',
  alreadyRunning = 'alreadyRunningSame',
}

export type StartProcessDialogWarning = StartProcessDialogFormWarning | ProcessesBatchValidationResult;
