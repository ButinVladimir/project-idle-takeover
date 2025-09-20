import { msg } from '@lit/localize';
import { FactionsPageTabs } from './types';

export const FACTIONS_PAGE_TABS_LIST = Array.from(Object.values(FactionsPageTabs));

export const FACTIONS_PAGE_TAB_TITLES: Record<FactionsPageTabs, () => string> = {
  [FactionsPageTabs.faction]: () => msg('Factions'),
};
