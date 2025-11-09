import { IPoint, Faction } from '@shared/index';
import { IDistrictSerializedState } from './serialized-states';
import { DistrictUnlockState } from '../types';
import { IDistrictParameters } from './parameters';
import { IDistrictTypeTemplate } from './district-type-template';
import { IDistrictContractsState } from './contracts';

export interface IDistrictState {
  index: number;
  template: IDistrictTypeTemplate;
  name: string;
  startingPoint: IPoint;
  districtType: string;
  state: DistrictUnlockState;
  faction: Faction;
  parameters: IDistrictParameters;
  contracts: IDistrictContractsState;
  recalculate(): void;
  serialize(): IDistrictSerializedState;
  removeAllEventListeners(): void;
}
