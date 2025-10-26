import { IProcess } from '@state/mainframe-state';
import { createContext } from '@lit/context';

export const processContext = createContext<IProcess>(Symbol('PROCESS_CONTEXT'));
