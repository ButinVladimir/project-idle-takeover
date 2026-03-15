import { ISerializeable, IExponent } from '@shared/index';
import { MainframeHardwareParameterType } from '../types';
import { IMainframeHardwareParameterSerializedState } from './mainframe-hardware-parameter-serialized-state';

export interface IMainframeHardwareParameter extends ISerializeable<IMainframeHardwareParameterSerializedState> {
  type: MainframeHardwareParameterType;
  priceExp: IExponent;
  autoUpgradeEnabled: boolean;
  level: number;
  totalLevel: number;
  purchase(increase: number): boolean;
}
