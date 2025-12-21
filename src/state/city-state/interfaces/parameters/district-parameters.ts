import { IDistrictSerializedParameters } from '../serialized-states';
import { IDistrictConnectivityParameter } from './district-connectivity-parameter';
import { IDistrictExperienceShareMultiplierParameter } from './district-experience-share-multiplier-parameter';
import { IDistrictProcessCompletionSpeedParameter } from './district-process-completion-speed-parameter';
import { IDistrictRewardsParameter } from './district-rewards-parameter';
import { IDistrictSynchronizationParameter } from './district-synchronization-parameter';
import { IDistrictInfluenceParameter } from './district-influence-parameter';
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
