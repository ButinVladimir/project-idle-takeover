import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { Hotkey, typedConstants } from '@shared/index';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { ISettingsHotkeys } from './interfaces';
import { SettingsHotkeysSerializedState } from './serialized-states';

const { lazyInject } = decorators;

export class SettingsHotkeys implements ISettingsHotkeys {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _hotkeyMap: Map<Hotkey, string>;
  private _keyMap: Map<string, Hotkey>;

  constructor() {
    this._hotkeyMap = new Map<Hotkey, string>();
    this._keyMap = new Map<string, Hotkey>();

    this._stateUiConnector.registerEventEmitter(this, ['_keyMap', '_hotkeyMap']);
  }

  getHotkeyByKey(key: string): Hotkey | undefined {
    const convertedKey = this.convertKey(key);

    return this._keyMap.get(convertedKey);
  }

  getKeyByHotkey(hotkey: Hotkey): string | undefined {
    return this._hotkeyMap.get(hotkey);
  }

  setHotkey(hotkey: Hotkey, key: string) {
    const convertedKey = this.convertKey(key);
    const existingHotkey = this.getHotkeyByKey(convertedKey);

    if (existingHotkey) {
      this._hotkeyMap.delete(existingHotkey);
    }

    const existingKey = this.getKeyByHotkey(hotkey);

    if (existingKey) {
      this._keyMap.delete(existingKey);
    }

    this._hotkeyMap.set(hotkey, convertedKey);
    this._keyMap.set(convertedKey, hotkey);
  }

  unassignHotkeys() {
    this._hotkeyMap.clear();
    this._keyMap.clear();
  }

  restoreDefaultHotkeys() {
    this.restoreHotkeys(typedConstants.defaultSettings.hotkeys);
  }

  async startNewState(): Promise<void> {
    this.restoreDefaultHotkeys();
  }

  async deserialize(serializedState: SettingsHotkeysSerializedState): Promise<void> {
    this.restoreHotkeys(serializedState);
  }

  serialize(): SettingsHotkeysSerializedState {
    return Object.fromEntries(this._hotkeyMap.entries()) as SettingsHotkeysSerializedState;
  }

  private restoreHotkeys(hotkeysState: SettingsHotkeysSerializedState) {
    this.unassignHotkeys();

    Object.entries(hotkeysState).forEach(([hotkey, key]) => {
      const typedHotkey = hotkey as Hotkey;
      const convertedKey = this.convertKey(key);

      this._hotkeyMap.set(typedHotkey, convertedKey);
      this._keyMap.set(convertedKey, typedHotkey);
    });
  }

  private convertKey(key: string): string {
    return key.toLocaleLowerCase();
  }
}
