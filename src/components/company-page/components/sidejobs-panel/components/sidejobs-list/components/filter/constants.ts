import { msg } from '@lit/localize';
import { ActivityStatusFilterValue } from '@shared/index';

export const SIDEJOB_STATUS_FILTER_TEXTS: Record<ActivityStatusFilterValue, () => string> = {
  [ActivityStatusFilterValue.all]: () => msg('All'),
  [ActivityStatusFilterValue.active]: () => msg('Only active'),
  [ActivityStatusFilterValue.inactive]: () => msg('Only inactive'),
};
