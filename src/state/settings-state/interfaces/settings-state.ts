import { ISerializeable } from '@shared/interfaces';
import { Language, Theme, LongNumberFormat } from '@shared/types';
import { ISettingsSerializedState } from './settings-serialized-state';
import { ISettingsHotkeys } from './settings-hotkeys';
import { ISettingsMessageEvents } from './settings-message-events';
import { ISettingsGameAlerts } from './settings-game-alerts';
import { ISettingsNotificationTypes } from './settings-notification-types';

export interface ISettingsState extends ISerializeable<ISettingsSerializedState> {
  language: Language;
  theme: Theme;
  messageLogSize: number;
  toastDuration: number;
  updateInterval: number;
  autosaveEnabledOnHide: boolean;
  autosaveInterval: number;
  fastSpeedMultiplier: number;
  maxUpdatesPerTick: number;
  longNumberFormat: LongNumberFormat;
  messageEvents: ISettingsMessageEvents;
  gameAlerts: ISettingsGameAlerts;
  notificationTypes: ISettingsNotificationTypes;
  hotkeys: ISettingsHotkeys;
  setLanguage(language: Language): Promise<void>;
  setTheme(theme: Theme): void;
  setMessageLogSize(messageLogSize: number): void;
  setToastDuration(duration: number): void;
  setUpdateInterval(updateInterval: number): void;
  setAutosaveEnabledOnHide(autosaveEnabled: boolean): void;
  setAutosaveInterval(autosaveInterval: number): void;
  setFastSpeedMultiplier(fastSpeedMultiplier: number): void;
  setMaxUpdatesPerTick(maxUpdatesPerTick: number): void;
  setLongNumberFormat(longNumberFormat: LongNumberFormat): void;
  restoreDefaultSettings(): Promise<void>;
}
