import { IContract } from '@state/activity-state';
import { createContext } from '@lit/context';

export const temporaryContractContext = createContext<IContract | undefined>(Symbol('TEMPORARY_CONTRACT'));
export const existingContractContext = createContext<IContract | undefined>(Symbol('EXISTING_CONTRACT'));
