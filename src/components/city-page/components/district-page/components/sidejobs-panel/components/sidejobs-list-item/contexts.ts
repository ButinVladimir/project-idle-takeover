import { createContext } from '@lit/context';

export const sidejobNameContext = createContext<string>(Symbol('SIDEJOB_NAME'));
