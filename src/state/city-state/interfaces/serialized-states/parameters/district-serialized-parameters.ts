import { IDistrictConnectivitySerializedParameter } from './district-connectivity-serialized-parameter';
import { IDistrictRewardsSerializedParameter } from './district-rewards-serialized-parameter';
import { IDistrictSerializedMultipliers } from './district-serialized-multipliers';
import { IDistrictInfluenceSerializedParameter } from './district-influence-serialized-parameter';

export interface IDistrictSerializedParameters {
  tier: IDistrictInfluenceSerializedParameter;
  connectivtiy: IDistrictConnectivitySerializedParameter;
  multipliers: IDistrictSerializedMultipliers;
  rewards: IDistrictRewardsSerializedParameter;
}
