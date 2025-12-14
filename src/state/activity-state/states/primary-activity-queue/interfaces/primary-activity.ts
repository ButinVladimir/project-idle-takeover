import { DistrictTypeRewardParameter, IncomeSource } from '@shared/index';
import { IClone } from '@state/clones-state';
import { IDistrictState } from '@state/city-state';
import { PrimaryActivityPerformResult, PrimaryActivityState, PrimaryActivityType } from '../types';
import { ISerializedPrimaryActivity } from './serialized-primary-activity';

export interface IPrimaryActivity {
  activityId: string;
  type: PrimaryActivityType;
  assignmentId: string;
  state: PrimaryActivityState;
  assignedClones: IClone[];
  district: IDistrictState;
  incomeSource: IncomeSource;
  getParameterReward(parameter: DistrictTypeRewardParameter): number | undefined;
  getActivityAddedMessage(): string;
  getActivityCancelledMessage(): string;
  start(): boolean;
  perform(): PrimaryActivityPerformResult;
  abortCurrentCompletion(): void;
  serialize(): ISerializedPrimaryActivity;
  removeAllEventListeners(): void;
}
