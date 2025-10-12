import { ProgramName } from '@state/mainframe-state';

export interface IFactionValues {
  loans: {
    programs: ProgramName[];
    cloneTemplates: string[];
  };
  special: {
    programs: ProgramName[];
    cloneTemplates: string[];
  };
}
