import { IClone } from '@state/clones-state';
import { createContext } from '@lit/context';

export const modalCloneContext = createContext<IClone>(Symbol('MODAL_CLONE'));
