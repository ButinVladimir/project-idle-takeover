import { IClone } from '@state/clones-state';
import { createContext } from '@lit/context';

export const modalSelectedCloneContext = createContext<IClone>(Symbol('MODAL_SELECTED_CLONE'));
