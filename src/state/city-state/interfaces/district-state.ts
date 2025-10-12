import { IPoint } from '@shared/interfaces/point';
import { Faction } from '@shared/types';
import { IDistrictSerializedState } from './serialized-states/district-serialized-state';
import { DistrictUnlockState } from '../types';
import { IDistrictParameters } from './district-parameters';
import { IDistrictTypeTemplate } from './district-type-template';

export interface IDistrictState {
  index: number;
  template: IDistrictTypeTemplate;
  name: string;
  startingPoint: IPoint;
  districtType: string;
  state: DistrictUnlockState;
  faction: Faction;
  parameters: IDistrictParameters;
  recalculate(): void;
  serialize(): IDistrictSerializedState;
  removeAllEventListeners(): void;
}
