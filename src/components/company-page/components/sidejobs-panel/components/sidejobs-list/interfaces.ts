import { StateFilterValue, ActivityStatusFilterValue } from '@shared/index';

export interface ISidejobsFilterState {
  cloneIds: string[];
  districtIndexes: number[];
  sidejobNames: string[];
  state: ActivityStatusFilterValue;
  enabled: StateFilterValue;
}
