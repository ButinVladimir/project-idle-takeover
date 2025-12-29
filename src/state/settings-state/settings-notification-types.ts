import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { NOTIFICATION_TYPES, NotificationType } from '@shared/index';
import { ISettingsNotificationTypes } from './interfaces';
import { SettingsNotificationTypesSerializedState } from './serialized-states';

const { lazyInject } = decorators;

export class SettingsNotificationTypes implements ISettingsNotificationTypes {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _enabledNotificationTypes: Set<NotificationType>;

  constructor() {
    this._enabledNotificationTypes = new Set<NotificationType>();

    this._stateUiConnector.registerEventEmitter(this, ['_enabledNotificationTypes']);
  }

  isNotificationTypeEnabled(notificationType: NotificationType): boolean {
    return this._enabledNotificationTypes.has(notificationType);
  }

  checkSomeNotificationsTypesEnabled(): boolean {
    return NOTIFICATION_TYPES.some((notification) => this.isNotificationTypeEnabled(notification));
  }

  toggleNotificationType(notificationType: NotificationType, enabled: boolean): void {
    if (enabled) {
      this._enabledNotificationTypes.add(notificationType);
    } else {
      this._enabledNotificationTypes.delete(notificationType);
    }
  }

  toggleAllNotificationTypes(enabled: boolean): void {
    NOTIFICATION_TYPES.forEach((notification) => {
      this.toggleNotificationType(notification, enabled);
    });
  }

  async startNewState(): Promise<void> {
    this._enabledNotificationTypes.clear();
    this.toggleAllNotificationTypes(true);
  }

  async deserialize(serializedState: SettingsNotificationTypesSerializedState): Promise<void> {
    this._enabledNotificationTypes.clear();
    serializedState.forEach((notification) => {
      this.toggleNotificationType(notification, true);
    });
  }

  serialize(): SettingsNotificationTypesSerializedState {
    return Array.from(this._enabledNotificationTypes.values());
  }
}
