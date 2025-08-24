import { IDistrictSerializedParameters } from './serialized-states/district-serialized-parameters';
import {
  IDistrictConnectivityParameter,
  IDistrictExperienceShareMultiplierParameter,
  IDistrictProcessCompletionSpeedParameter,
  IDistrictRewardsParameter,
  IDistrictSynchronizationParameter,
  IDistrictTierParameter,
} from './parameters';
import { IDistrictMultipliers } from './district-multipliers';

export interface IDistrictParameters {
  tier: IDistrictTierParameter;
  synchronization: IDistrictSynchronizationParameter;
  connectivity: IDistrictConnectivityParameter;
  rewards: IDistrictRewardsParameter;
  multipliers: IDistrictMultipliers;
  processCompletionSpeed: IDistrictProcessCompletionSpeedParameter;
  experienceShareMultiplier: IDistrictExperienceShareMultiplierParameter;
  recalculate(): void;
  serialize(): IDistrictSerializedParameters;
  deserialize(serializedParameters: IDistrictSerializedParameters): void;
  removeAllEventListeners(): void;
}
