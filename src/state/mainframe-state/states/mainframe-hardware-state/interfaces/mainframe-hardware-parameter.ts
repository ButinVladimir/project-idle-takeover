import { ISerializeable } from '@shared/interfaces/serializable';
import { MainframeHardwareParameterType } from '../types';
import { IMainframeHardwareParameterSerializedState } from './mainframe-hardware-parameter-serialized-state';

export interface IMainframeHardwareParameter extends ISerializeable<IMainframeHardwareParameterSerializedState> {
  type: MainframeHardwareParameterType;
  autoUpgradeEnabled: boolean;
  level: number;
  totalLevel: number;
  getIncreaseCost(increase: number): number;
  purchase(increase: number): boolean;
  checkCanPurchase(increase: number): boolean;
}
