import { msg } from '@lit/localize';
import { OverviewPageTabs } from './types';

export const OVERVIEW_PAGE_TABS_LIST = Array.from(Object.values(OverviewPageTabs));

export const KEYS_SEPARATOR = ';';

export const OVERVIEW_PAGE_TAB_TITLES = {
  [OverviewPageTabs.progress]: () => msg('Progress'),
  [OverviewPageTabs.story]: () => msg('Story'),
  [OverviewPageTabs.unlockedContent]: () => msg('Unlocked content'),
};
