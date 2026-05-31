import { ActivityStatusFilterValue } from '@shared/index';

export interface IPrimaryActivityFilterState {
  cloneIds: string[];
  districtIndexes: number[];
  status: ActivityStatusFilterValue;
}
