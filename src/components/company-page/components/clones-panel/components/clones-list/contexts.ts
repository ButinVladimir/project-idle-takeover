import { createContext } from '@lit/context';
import { IClonesFilterState } from './interfaces';
import { ClonesListType } from './types';

export const clonesFilterStateContext = createContext<IClonesFilterState>(Symbol('CLONES_FILTER_STATE_CONTEXT'));
export const clonesListContext = createContext<ClonesListType>(Symbol('CLONES_LIST'));
