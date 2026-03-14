import { ProgramValidationResult } from '@state/mainframe-state';

export enum PurchaseProgramDialogFormWarning {
  notSelected = 'notSelected',
  willBeAvailableIn = 'willBeAvailableIn',
  alreadyPurchased = 'alreadyPurchased',
}

export type PurchaseProgramDialogWarning = PurchaseProgramDialogFormWarning | ProgramValidationResult;
