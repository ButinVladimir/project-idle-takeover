import { createContext } from '@lit/context';
import { IProgramsFilterState } from './interfaces';
import { ProgramsList } from './types';

export const programsFilterStateContext = createContext<IProgramsFilterState>(Symbol('PROGRAMS_FILTER_STATE_CONTEXT'));
export const programsListContext = createContext<ProgramsList>(Symbol('PROGRAMS_LIST'));
