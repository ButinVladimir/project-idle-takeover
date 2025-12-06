import { createContext } from '@lit/context';
import { IContractAssignment } from '@/state/automation-state';

export const contractAssignmentActivityContext = createContext<IContractAssignment>(Symbol('ContractAssignment'));
