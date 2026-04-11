import { ISidejobActivity } from '@state/activity-state';

export type SidejobActivitiesList = ISidejobActivity[];

export enum SidejobStatusFilterValue {
  all = 'all',
  active = 'active',
  inactive = 'inactive',
}
