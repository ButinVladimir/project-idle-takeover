import { createContext } from '@lit/context';
import { IProgram } from '@state/mainframe-state';

export const temporaryProgramContext = createContext<IProgram | undefined>(Symbol('TEMPORARY_PROGRAM'));
export const existingProgramContext = createContext<IProgram | undefined>(Symbol('EXISTING_PROGRAM'));
