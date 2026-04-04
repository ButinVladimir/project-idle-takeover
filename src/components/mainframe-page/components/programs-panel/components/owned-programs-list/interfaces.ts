import { StatusFilterValue, LevelFilterValue } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export interface IProgramsFilterState {
  programs: ProgramName[];
  tiers: number[];
  maxTier: LevelFilterValue;
  maxLevel: LevelFilterValue;
  autoupgrade: StatusFilterValue;
}
