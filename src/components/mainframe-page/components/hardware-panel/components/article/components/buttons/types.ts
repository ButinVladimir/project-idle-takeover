import { MainframeHardwareValidationResult } from '@state/mainframe-state';

export enum MainframeHardwarePanelArticleWarning {
  willBeAvailableIn = 'willBeAvailableIn',
}

export type MainframeHardwareWarning = MainframeHardwarePanelArticleWarning | MainframeHardwareValidationResult;
