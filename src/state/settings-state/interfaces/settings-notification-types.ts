import { ISerializeable, NotificationType } from '@shared/index';
import { SettingsNotificationTypesSerializedState } from '../serialized-states';

export interface ISettingsNotificationTypes extends ISerializeable<SettingsNotificationTypesSerializedState> {
  isNotificationTypeEnabled(notificationType: NotificationType): boolean;
  checkSomeNotificationsTypesEnabled(): boolean;
  toggleNotificationType(notificationType: NotificationType, enabled: boolean): void;
  toggleAllNotificationTypes(enabled: boolean): void;
}
