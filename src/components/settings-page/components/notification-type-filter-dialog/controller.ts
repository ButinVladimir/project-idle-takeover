import { BaseController, NotificationType } from '@shared/index';

export class NotificationTypeFilterDialogController extends BaseController {
  isNotificationTypeEnabled(notificationType: NotificationType): boolean {
    return this.settingsState.notificationTypes.isNotificationTypeEnabled(notificationType);
  }

  checkSomeNotificationTypesEnabled(): boolean {
    return this.settingsState.notificationTypes.checkSomeNotificationsTypesEnabled();
  }

  toggleNotificationTypeFilter(notificationType: NotificationType, enabled: boolean) {
    this.settingsState.notificationTypes.toggleNotificationType(notificationType, enabled);
    this.host.requestUpdate();
  }

  toggleAllNotificationTypes(enabled: boolean) {
    this.settingsState.notificationTypes.toggleAllNotificationTypes(enabled);
    this.host.requestUpdate();
  }
}
