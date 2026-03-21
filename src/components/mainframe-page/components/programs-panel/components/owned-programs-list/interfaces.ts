import { ProgramName } from '@/state/mainframe-state';

export interface IProgramsFilterState {
  programs: ProgramName[];
  tiers: number[];
}
