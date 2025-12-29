import { msg } from '@lit/localize';
import { OverviewMenuItem, MiscMenuItem } from '@shared/types';

export const MENU_ITEMS: Record<OverviewMenuItem | MiscMenuItem, () => string> = {
  [OverviewMenuItem.automation]: () => msg('Automation'),
  [OverviewMenuItem.city]: () => msg('City'),
  [OverviewMenuItem.company]: () => msg('Company'),
  [OverviewMenuItem.mainframe]: () => msg('Mainframe'),
  [OverviewMenuItem.factions]: () => msg('Factions'),
  [OverviewMenuItem.statistics]: () => msg('Statistics'),
  [OverviewMenuItem.overview]: () => msg('Overview'),
  [OverviewMenuItem.messageLog]: () => msg('Message log'),
  [MiscMenuItem.credits]: () => msg('Credits'),
  [MiscMenuItem.settings]: () => msg('Settings'),
};
