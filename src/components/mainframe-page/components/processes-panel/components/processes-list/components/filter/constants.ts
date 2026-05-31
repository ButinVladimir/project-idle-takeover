import { msg } from '@lit/localize';
import { CoreFilterValue } from '../../types';

export const CORE_FILTER_VALUES = Object.values(CoreFilterValue);

export const CORE_FILTER_TEXTS: Record<CoreFilterValue, () => string> = {
  [CoreFilterValue.notAssigned]: () => msg('Not assigned'),
  [CoreFilterValue.partiallyAssigned]: () => msg('Partially assigned'),
  [CoreFilterValue.fullyAssigned]: () => msg('Fully assigned'),
};
