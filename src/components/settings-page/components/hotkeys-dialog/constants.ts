import { msg } from '@lit/localize';
import { Hotkey } from '@shared/index';

export const HOTKEY_NAMES: Record<Hotkey, () => string> = {
  [Hotkey.pause]: () => msg('Pause'),
  [Hotkey.playNormalSpeed]: () => msg('Play on normal speed'),
  [Hotkey.playFastSpeed]: () => msg('Play on fast speed'),
  [Hotkey.saveGame]: () => msg('Save game'),
  [Hotkey.addContractAssignments]: () => msg('Add contract assignments to the primary activity queue'),
  [Hotkey.upgradeMainframeHardware]: () => msg('Upgrade mainframe hardware'),
  [Hotkey.upgradeMainframePerformance]: () => msg('Upgrade mainframe performance'),
  [Hotkey.upgradeMainframeRam]: () => msg('Upgrade mainframe RAM'),
  [Hotkey.upgradeMainframeCores]: () => msg('Upgrade mainframe cores'),
  [Hotkey.upgradeMainframePrograms]: () => msg('Upgrade mainframe programs'),
  [Hotkey.upgradeClonesLevel]: () => msg('Upgrade clones levels'),
};
