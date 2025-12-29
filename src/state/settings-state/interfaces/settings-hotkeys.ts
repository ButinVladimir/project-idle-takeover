import { Hotkey, ISerializeable } from '@shared/index';
import { SettingsHotkeysSerializedState } from '../serialized-states';

export interface ISettingsHotkeys extends ISerializeable<SettingsHotkeysSerializedState> {
  getHotkeyByKey(key: string): Hotkey | undefined;
  getKeyByHotkey(hotkey: Hotkey): string | undefined;
  setHotkey(hotkey: Hotkey, key: string): void;
  unassignHotkeys(): void;
  restoreDefaultHotkeys(): void;
}
