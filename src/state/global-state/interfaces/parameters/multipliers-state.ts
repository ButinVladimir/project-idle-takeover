import { ISerializeable } from '@shared/index';
import { IMultipliersSerializedState } from '../serialized-states';
import { IMultiplierState } from './multiplier-state';

export interface IMultipliersState extends ISerializeable<IMultipliersSerializedState> {
  codeBase: IMultiplierState;
  computationalBase: IMultiplierState;
  recalculate(): void;
}
