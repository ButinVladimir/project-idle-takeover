import { CloneValidationResult } from '@state/clones-state';

export enum PurchaseCloneDialogFormWarning {
  cloneTemplateNotSelected = 'cloneTemplateNotSelected',
  willBeAvailableIn = 'willBeAvailableIn',
}

export type PurchaseCloneDialogWarning = PurchaseCloneDialogFormWarning | CloneValidationResult;
