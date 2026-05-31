import { createContext } from '@lit/context';
import { IContractsFilterState } from './interfaces';
import { ContractAssignmentsList } from './types';

export const contractsFilterStateContext = createContext<IContractsFilterState>(
  Symbol('CONTRACTS_FILTER_STATE_CONTEXT'),
);
export const contractsListContext = createContext<ContractAssignmentsList>(Symbol('CONTRACTS_LIST'));
