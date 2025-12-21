import { IPrimaryActivity } from '@state/activity-state';
import { createContext } from '@lit/context';

export const primaryActivityContext = createContext<IPrimaryActivity>(Symbol('PRIMARY_ACTIVITY'));
