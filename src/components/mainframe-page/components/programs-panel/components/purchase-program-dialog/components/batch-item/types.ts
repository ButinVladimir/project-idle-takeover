import { ProgramValidationResult } from '@state/mainframe-state';

export enum PurchaseProgramDialogBatchItemFormWarning {
  alreadyPurchased = 'alreadyPurchased',
}

export type PurchaseProgramDialogBatchItemWarning = PurchaseProgramDialogBatchItemFormWarning | ProgramValidationResult;
