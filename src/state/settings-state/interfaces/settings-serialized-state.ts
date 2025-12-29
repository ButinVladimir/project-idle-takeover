import { Language, LongNumberFormat, Theme } from '@shared/index';
import {
  SettingsGameAlertsSerializedState,
  SettingsHotkeysSerializedState,
  SettingsMessageEventsSerializedState,
  SettingsNotificationTypesSerializedState,
} from '../serialized-states';

export interface ISettingsSerializedState {
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
  enabledMessageEvents: SettingsMessageEventsSerializedState;
  enabledGameAlerts: SettingsGameAlertsSerializedState;
  enabledNotificationTypes: SettingsNotificationTypesSerializedState;
  hotkeys: SettingsHotkeysSerializedState;
}
