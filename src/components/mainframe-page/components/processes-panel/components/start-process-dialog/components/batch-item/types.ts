import { ProcessValidationResult } from '@state/mainframe-state';

export enum StartProcessDialogBatchItemFormWarning {
  alreadyStarted = 'alreadyStarted',
  autoscalableProcessAlreadyStarted = 'autoscalableProcessAlreadyStarted',
}

export type StartProcessDialogBatchItemWarning = StartProcessDialogBatchItemFormWarning | ProcessValidationResult;
