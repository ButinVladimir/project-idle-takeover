import { createContext } from '@lit/context';
import { IProcess, IProgram } from '@state/mainframe-state';

export const programContext = createContext<IProgram>(Symbol('PROGRAM_CONTEXT'));
export const existingProcessContext = createContext<IProcess>(Symbol('EXISTING_PROCESS_CONTEXT'));
