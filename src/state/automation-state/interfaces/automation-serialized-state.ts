import {
  IMainframeHardwareAutomationSerializedState,
  IMainframeProgramsAutomationSerializedState,
  ICloneLevelAutomationSerializedState,
  IContractsAutomationSerializedState,
} from '../states';

export interface IAutomationSerializedState {
  mainframeHardware: IMainframeHardwareAutomationSerializedState;
  mainframePrograms: IMainframeProgramsAutomationSerializedState;
  cloneLevel: ICloneLevelAutomationSerializedState;
  contracts: IContractsAutomationSerializedState;
}
