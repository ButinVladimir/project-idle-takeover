import { ISerializeable } from '@shared/index';
import {
  ICloneLevelAutomationState,
  IMainframeHardwareAutomationState,
  IMainframeProgramsAutomationState,
} from '../states';
import { IAutomationSerializedState } from './automation-serialized-state';
import { IContractsAutomationState } from '../states/contracts-automation-state';

export interface IAutomationState extends ISerializeable<IAutomationSerializedState> {
  mainframeHardware: IMainframeHardwareAutomationState;
  mainframePrograms: IMainframeProgramsAutomationState;
  cloneLevel: ICloneLevelAutomationState;
  contracts: IContractsAutomationState;
}
