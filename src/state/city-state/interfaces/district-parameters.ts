import { IDistrictSerializedParameters } from './serialized-states/district-serialized-parameters';
import {
  IDistrictConnectivityParameter,
  IDistrictExperienceShareMultiplierParameter,
  IDistrictProcessCompletionSpeedParameter,
  IDistrictRewardsParameter,
  IDistrictSynchronizationParameter,
  IDistrictInfluenceParameter,
} from './parameters';
import { IDistrictMultipliers } from './district-multipliers';

export interface IDistrictParameters {
  influence: IDistrictInfluenceParameter;
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
