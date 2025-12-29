import { GameAlertGroup, GameAlert, ISerializeable } from '@shared/index';
import { SettingsGameAlertsSerializedState } from '../serialized-states';

export interface ISettingsGameAlerts extends ISerializeable<SettingsGameAlertsSerializedState> {
  isAlertEnabled(event: GameAlert): boolean;
  checkGroupHasEnabledAlerts(group: GameAlertGroup): boolean;
  checkSomeAlertsEnabled(): boolean;
  toggleAlert(event: GameAlert, enabled: boolean): void;
  toggleGroup(group: GameAlertGroup, enabled: boolean): void;
  toggleAllAlerts(enabled: boolean): void;
}
