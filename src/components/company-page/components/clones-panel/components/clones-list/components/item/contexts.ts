import { IClone } from '@state/clones-state';
import { createContext } from '@lit/context';

export const cloneContext = createContext<IClone>(Symbol('CLONE'));
