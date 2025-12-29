import { BaseController } from '@shared/index';
import { INotification } from '@state/notifications-state';

export class NotificationModalController extends BaseController {
  hasUnreadNotifications(): boolean {
    return this.notificationsState.hasUnreadNotifications();
  }

  hasNextNotification(): boolean {
    return this.notificationsState.hasNextNotification();
  }

  getUnreadNotification(): INotification | undefined {
    return this.notificationsState.getFirstUnreadNotification();
  }

  clearNotifications() {
    this.notificationsState.clearNotifications();
    this.host.requestUpdate();
  }

  popNotification(enabled: boolean): void {
    const notification = this.getUnreadNotification();

    if (notification) {
      this.settingsState.notificationTypes.toggleNotificationType(notification.notificationType, enabled);
      this.notificationsState.popUnreadNotification();
      this.host.requestUpdate();
    }
  }
}
