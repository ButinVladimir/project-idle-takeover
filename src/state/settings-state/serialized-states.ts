import { GameAlert, Hotkey, MessageEvent, NotificationType } from '@shared/index';

export type SettingsMessageEventsSerializedState = MessageEvent[];

export type SettingsGameAlertsSerializedState = GameAlert[];

export type SettingsNotificationTypesSerializedState = NotificationType[];

export type SettingsHotkeysSerializedState = Record<Hotkey, string>;
