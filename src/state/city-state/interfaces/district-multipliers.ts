import { IDistrictMultiplierParameter } from './parameters';
import { IDistrictSerializedMultipliers } from './serialized-states/district-serialized-multipliers';

export interface IDistrictMultipliers {
  codeBase: IDistrictMultiplierParameter;
  computationalBase: IDistrictMultiplierParameter;
  serialize(): IDistrictSerializedMultipliers;
  deserialize(serializedState: IDistrictSerializedMultipliers): void;
}
