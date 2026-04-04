import { StatusFilterValue } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';
import { CoreFilterValue } from './types';

export interface IProcessesFilterState {
  programs: ProgramName[];
  cores: CoreFilterValue[];
  status: StatusFilterValue;
}
