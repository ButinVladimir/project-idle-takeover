import { DistrictTypeRewardParameter } from '@shared/index';
import { PrimaryActivityState, PrimaryActivityType } from '../types';

export interface ISerializedPrimaryActivity {
  activityId: string;
  type: PrimaryActivityType;
  state: PrimaryActivityState;
  parameterRewards: Record<DistrictTypeRewardParameter, number>;
}
