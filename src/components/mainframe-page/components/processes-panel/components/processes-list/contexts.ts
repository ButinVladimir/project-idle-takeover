import { createContext } from '@lit/context';
import { IProcessesFilterState } from './interfaces';
import { ProcessesList } from './types';

export const processesFilterStateContext = createContext<IProcessesFilterState>(
  Symbol('PROCESSES_FILTER_STATE_CONTEXT'),
);
export const processesListContext = createContext<ProcessesList>(Symbol('PROCESSES_LIST'));
