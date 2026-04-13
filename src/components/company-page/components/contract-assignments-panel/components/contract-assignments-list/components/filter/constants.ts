import { msg } from '@lit/localize';
import { ActivityStatusFilterValue } from '@shared/index';

export const CONTRACT_STATUS_FILTER_TEXTS: Record<ActivityStatusFilterValue, () => string> = {
  [ActivityStatusFilterValue.all]: () => msg('All'),
  [ActivityStatusFilterValue.active]: () => msg('Only queued'),
  [ActivityStatusFilterValue.inactive]: () => msg('Only unqueued'),
};
