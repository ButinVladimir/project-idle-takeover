import { msg } from '@lit/localize';
import { Hotkey } from '@shared/index';

export const HOTKEY_NAMES: Record<Hotkey, () => string> = {
  [Hotkey.pause]: () => msg('Pause'),
  [Hotkey.playNormalSpeed]: () => msg('Play on normal speed'),
  [Hotkey.playFastSpeed]: () => msg('Play on fast speed'),
  [Hotkey.saveGame]: () => msg('Save game'),
  [Hotkey.addContractAssignments]: () => msg('Add contract assignments to the primary activity queue'),
  [Hotkey.upgradeMainframeHardware]: () => msg('Upgrade max mainframe hardware'),
  [Hotkey.upgradeMainframePerformance]: () => msg('Upgrade max mainframe performance'),
  [Hotkey.upgradeMainframeRam]: () => msg('Upgrade max mainframe RAM'),
  [Hotkey.upgradeMainframeCores]: () => msg('Upgrade max mainframe cores'),
  [Hotkey.upgradeMainframePrograms]: () => msg('Upgrade max mainframe programs'),
  [Hotkey.upgradeClonesLevel]: () => msg('Upgrade max clones levels'),
};
