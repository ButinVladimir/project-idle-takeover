import { IDistrictMultiplierParameter } from './district-multiplier-parameter';
import { IDistrictSerializedMultipliers } from '../serialized-states';

export interface IDistrictMultipliers {
  codeBase: IDistrictMultiplierParameter;
  computationalBase: IDistrictMultiplierParameter;
  serialize(): IDistrictSerializedMultipliers;
  deserialize(serializedState: IDistrictSerializedMultipliers): void;
}
