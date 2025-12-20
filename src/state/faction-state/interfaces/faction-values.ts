import { ProgramName } from '@state/mainframe-state';

export interface IFactionValues {
  playstyle: 'selectFaction' | 'captureCity' | 'raiseThreat';
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
