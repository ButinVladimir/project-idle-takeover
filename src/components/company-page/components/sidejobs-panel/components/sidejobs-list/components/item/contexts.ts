import { createContext } from '@lit/context';
import { ISidejobActivity } from '@state/activity-state';

export const sidejobActivityContext = createContext<ISidejobActivity>(Symbol('SidejobActivity'));
