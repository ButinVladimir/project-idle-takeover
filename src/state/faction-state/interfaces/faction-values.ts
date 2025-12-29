import { ProgramName } from '@state/mainframe-state';
import { FactionPlaystyle } from '../types';

export interface IFactionValues {
  playstyle: FactionPlaystyle;
  loanedItems: {
    programs: ProgramName[];
    cloneTemplates: string[];
  };
  specialItems: {
    programs: ProgramName[];
    cloneTemplates: string[];
  };
  activities: {
    contracts: string[];
  };
}
