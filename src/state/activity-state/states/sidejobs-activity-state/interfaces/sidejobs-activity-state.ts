import { ISerializeable } from '@shared/index';
import { ISidejobsActivitySerializedState } from './sidejobs-activity-serialized-state';
import { ISidejobActivity } from './sidejob-activity';
import { ISerializedSidejob } from '../../sidejobs-factory';

export interface ISidejobsActivityState extends ISerializeable<ISidejobsActivitySerializedState> {
  listActivities(): ISidejobActivity[];
  getActivityByCloneId(cloneId: string): ISidejobActivity | undefined;
  getActivityById(sidejobId: string): ISidejobActivity | undefined;
  assignSidejob(sidejobParameters: ISerializedSidejob): boolean;
  cancelActivity(sidejobId: string): void;
  cancelAllActivities(): void;
  perform(): void;
}
