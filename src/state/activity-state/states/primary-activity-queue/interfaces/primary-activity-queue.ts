import { ISerializeable } from '@shared/index';
import { IPrimaryActivity } from './primary-activity';
import { IPrimaryActivityArgs } from './primary-activity-args';
import { ISerializedPrimaryActivityQueue } from './serialized-primary-activity-queue';

export interface IPrimaryActivityQueue extends ISerializeable<ISerializedPrimaryActivityQueue> {
  addActivity(primaryActivityArgs: IPrimaryActivityArgs): boolean;
  listActivities(): IPrimaryActivity[];
  getActivityById(id: string): IPrimaryActivity | undefined;
  getActivityByAssignmentId(assignmentId: string): IPrimaryActivity | undefined;
  cancelActivityById(id: string): void;
  cancelActivitiesByAssignmentId(assignmentId: string): void;
  cancelAllActivities(): void;
  perform(): void;
  filterActivities(): void;
}
