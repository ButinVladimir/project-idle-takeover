import { injectable } from 'inversify';
import type { IStateUIConnector } from '@state/state-ui-connector';
import type { ISettingsState } from '@state/settings-state';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { FORCE_NOTIFICATION_TYPES, NotificationType } from '@shared/index';
import { INotificationsState, INotification } from './interfaces';

const { lazyInject } = decorators;

@injectable()
export class NotificationsState implements INotificationsState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  private readonly _notifications: INotification[];

  constructor() {
    this._notifications = [];

    this._stateUiConnector.registerEventEmitter(this, ['_notifications']);
  }

  pushNotification(notificationType: NotificationType, message: string) {
    if (!this.isNotificationTypeEnabled(notificationType)) {
      return;
    }

    this._notifications.push({
      notificationType,
      message,
    });
  }

  getFirstUnreadNotification(): INotification | undefined {
    while (this.hasUnreadNotifications()) {
      const notification = this._notifications[0];

      if (this.isNotificationTypeEnabled(notification.notificationType)) {
        return notification;
      }

      this._notifications.shift();
    }

    return undefined;
  }

  hasUnreadNotifications(): boolean {
    return this._notifications.length > 0;
  }

  hasNextNotification(): boolean {
    return this._notifications.length > 1;
  }

  popUnreadNotification() {
    if (this.hasUnreadNotifications()) {
      this._notifications.shift();
    }
  }

  clearNotifications() {
    this._notifications.length = 0;
  }

  private isNotificationTypeEnabled(notificationType: NotificationType): boolean {
    return (
      FORCE_NOTIFICATION_TYPES.has(notificationType) ||
      this._settingsState.notificationTypes.isNotificationTypeEnabled(notificationType)
    );
  }
}
