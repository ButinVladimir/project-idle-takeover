import { createContext } from '@lit/context';

export const contractNameContext = createContext<string>(Symbol('CONTRACT_NAME'));
