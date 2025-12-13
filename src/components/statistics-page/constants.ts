import { msg, str } from '@lit/localize';
import { IncomeSource } from '@shared/types';
import { DISTRICT_NAMES } from '@texts/names';
import { StatisticsPageTabs } from './types';

export const STATISTICS_PAGE_TABS_LIST = Array.from(Object.values(StatisticsPageTabs));

export const STATISTICS_PAGE_TAB_NAMES = {
  [StatisticsPageTabs.expenses]: () => msg('Expenses'),
  [StatisticsPageTabs.general]: () => msg('General'),
  [StatisticsPageTabs.growth]: () => msg('Growth'),
  [StatisticsPageTabs.income]: () => msg('Income'),
};

export const INCOME_SOURCE_NAMES: Record<IncomeSource, () => string> = {
  [IncomeSource.program]: () => msg('By programs'),
  [IncomeSource.sidejob]: () => msg('By sidejobs'),
  [IncomeSource.contract]: () => msg('By contracts'),
};

export const STATISTIC_PAGE_TEXTS = {
  baseValue: () => msg('Base value'),
  byPrograms: () => msg('By programs'),
  byDistrict: (districtName: string) => msg(str`By district "${DISTRICT_NAMES[districtName]()}"`),
  inDistrict: (districtName: string) => msg(str`In district "${DISTRICT_NAMES[districtName]()}"`),
  total: () => msg('Total'),
};

export const POINT_MULTIPLIER_HINTS = {
  codeBase: () => msg('Code base affects cost multiplier for mainframe programs'),
  computationalBase: () => msg('Computational base affects cost multiplier for mainframe hardware upgrades'),
};

export const STATISTIC_HINTS = {
  connectivity: () =>
    msg(`Connectivity affects chances to receive new contracts and unlocks new sidejobs. 
Connectivity values are separate for each district.`),
  synchronization: () => msg('Synchronization affects how many clones can be in company.'),
  rewards: () =>
    msg(`Rewards affect all gains. 
Rewards multipliers are separate for each district and stack with program multiplier.`),
};
