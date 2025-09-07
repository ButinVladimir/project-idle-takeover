import { ProgramName } from '@state/mainframe-state';
import { CloneTemplateName } from '@state/company-state';

export interface IFactionValues {
  loans: {
    programs: ProgramName[];
    cloneTemplates: CloneTemplateName[];
  };
  special: {
    programs: ProgramName[];
    cloneTemplates: CloneTemplateName[];
  };
}
