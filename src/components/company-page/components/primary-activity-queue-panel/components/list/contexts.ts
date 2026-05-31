import { createContext } from '@lit/context';
import { IPrimaryActivityFilterState } from './interfaces';
import { PrimaryActivityListType } from './types';

export const primaryActivityFilterStateContext = createContext<IPrimaryActivityFilterState>(
  Symbol('PRIMARY_ACTIVITY_FILTER_STATE_CONTEXT'),
);
export const primaryActivityListContext = createContext<PrimaryActivityListType>(Symbol('PRIMARY_ACTIVITY_LIST'));
