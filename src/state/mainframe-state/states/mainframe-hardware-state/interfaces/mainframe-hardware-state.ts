import { ISerializeable } from '@shared/interfaces';
import { IMainframeHardwareSerializedState } from './mainframe-hardware-serialized-state';
import { IMainframeHardwareParameter } from './mainframe-hardware-parameter';
import { MainframeHardwareParameterType } from '../types';
import { IMainframeHardwareUpgrader } from './mainframe-hardware-upgrader';

export interface IMainframeHardwareState extends ISerializeable<IMainframeHardwareSerializedState> {
  performance: IMainframeHardwareParameter;
  cores: IMainframeHardwareParameter;
  ram: IMainframeHardwareParameter;
  upgrader: IMainframeHardwareUpgrader;
  listParameters(): IMainframeHardwareParameter[];
  moveParameter(parameterType: MainframeHardwareParameterType, newPosition: number): void;
}
