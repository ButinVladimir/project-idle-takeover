import { createContext } from '@lit/context';
import { ISidejobsFilterState } from './interfaces';
import { SidejobActivitiesList } from './types';

export const sidejobsFilterStateContext = createContext<ISidejobsFilterState>(Symbol('SIDEJOBS_FILTER_STATE_CONTEXT'));
export const sidejobsListContext = createContext<SidejobActivitiesList>(Symbol('SIDEJOBS_LIST'));
