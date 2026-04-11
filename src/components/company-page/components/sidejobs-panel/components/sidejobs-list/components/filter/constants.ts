import { msg } from '@lit/localize';
import { SidejobStatusFilterValue } from '../../types';

export const SIDEJOB_STATUS_FILTER_VALUES = Object.values(SidejobStatusFilterValue);

export const SIDEJOB_STATUS_FILTER_TEXTS: Record<SidejobStatusFilterValue, () => string> = {
  [SidejobStatusFilterValue.all]: () => msg('All'),
  [SidejobStatusFilterValue.active]: () => msg('Only active'),
  [SidejobStatusFilterValue.inactive]: () => msg('Only inactive'),
};
