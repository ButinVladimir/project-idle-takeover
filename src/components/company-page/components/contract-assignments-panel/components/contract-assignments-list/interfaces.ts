import { StateFilterValue, ActivityStatusFilterValue } from '@shared/index';

export interface IContractsFilterState {
  cloneIds: string[];
  districtIndexes: number[];
  contractNames: string[];
  state: ActivityStatusFilterValue;
  enabled: StateFilterValue;
}
