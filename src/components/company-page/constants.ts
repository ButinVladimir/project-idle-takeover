import { msg } from '@lit/localize';
import { CompanyPageTabs } from './types';

export const COMPANY_PAGE_TABS_LIST = Array.from(Object.values(CompanyPageTabs));

export const COMPANY_PAGE_TAB_TITLES: Record<CompanyPageTabs, () => string> = {
  [CompanyPageTabs.clones]: () => msg('Clones'),
  [CompanyPageTabs.sidejobs]: () => msg('Sidejobs'),
  [CompanyPageTabs.contractAssignments]: () => msg('Contracts assignments'),
  [CompanyPageTabs.primaryActivityQueue]: () => msg('Primary activity queue'),
};
