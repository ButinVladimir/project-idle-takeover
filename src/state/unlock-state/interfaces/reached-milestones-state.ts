import { DistrictTypeRewardParameter, ISerializeable, Milestone } from '@shared/index';
import { IReachedMilestonesSerializedState } from './serialized-states';

export interface IReachedMilestonesState extends ISerializeable<IReachedMilestonesSerializedState> {
  isMilestoneReached(milestone: Milestone): boolean;
  reachMilestone(milestone: Milestone): void;
  listReachedMilestones(): Milestone[];
  isRewardParameterUnlocked(parameter: DistrictTypeRewardParameter): boolean;
}
