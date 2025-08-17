import { IDistrictSerializedParameters } from './serialized-states/district-serialized-parameters';
import {
  IDistrictConnectivityParameter,
  IDistrictProcessCompletionSpeedParameter,
  IDistrictSynchronizationParameter,
  IDistrictTierParameter,
} from './parameters';
import { IDistrictMultipliers } from './district-multipliers';

export interface IDistrictParameters {
  tier: IDistrictTierParameter;
  synchronization: IDistrictSynchronizationParameter;
  connectivity: IDistrictConnectivityParameter;
  multipliers: IDistrictMultipliers;
  processCompletionSpeed: IDistrictProcessCompletionSpeedParameter;
  recalculate(): void;
  serialize(): IDistrictSerializedParameters;
  deserialize(serializedParameters: IDistrictSerializedParameters): void;
  removeAllEventListeners(): void;
}
