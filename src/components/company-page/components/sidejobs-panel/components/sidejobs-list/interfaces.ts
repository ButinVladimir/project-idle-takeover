import { StateFilterValue } from '@shared/index';
import { SidejobStatusFilterValue } from './types';

export interface ISidejobsFilterState {
  cloneIds: string[];
  districtIndexes: number[];
  sidejobNames: string[];
  status: SidejobStatusFilterValue;
  enabled: StateFilterValue;
}
