import { ISerializeable } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { ISidejobsActivitySerializedState } from './sidejobs-activity-serialized-state';
import { ISidejobActivity } from './sidejob-activity';

export interface ISidejobsActivityState extends ISerializeable<ISidejobsActivitySerializedState> {
  listActivities(): ISidejobActivity[];
  getActivityByCloneId(cloneId: string): ISidejobActivity | undefined;
  getActivityById(sidejobId: string): ISidejobActivity | undefined;
  assignSidejobs(sidejobName: string, district: IDistrictState, clones: IClone[]): boolean;
  cancelActivity(sidejobId: string): void;
  cancelActivities(sidejobIds: string[]): void;
  perform(): void;
}
