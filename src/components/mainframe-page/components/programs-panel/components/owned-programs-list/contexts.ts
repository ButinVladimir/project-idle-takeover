import { createContext } from '@lit/context';
import { IProgramsFilterState } from './interfaces';

export const programsFilterStateContext = createContext<IProgramsFilterState>(Symbol('PROGRAMS_FILTER_STATE_CONTEXT'));
