import { LevelFilterValue, StateFilterValue } from '@shared/index';

export interface IClonesFilterState {
  clones: string[];
  cloneTemplates: string[];
  tiers: number[];
  maxTier: LevelFilterValue;
  maxLevel: LevelFilterValue;
  autoupgrade: StateFilterValue;
}
