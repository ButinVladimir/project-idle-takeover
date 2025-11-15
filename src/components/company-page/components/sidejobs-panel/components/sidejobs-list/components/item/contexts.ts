import { createContext } from '@lit/context';
import { ISidejob } from '@state/activity-state';

export const sidejobContext = createContext<ISidejob>(Symbol('Sidejob'));
