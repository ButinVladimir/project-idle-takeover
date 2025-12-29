import { BaseController, GameAlert, GameAlertGroup } from '@shared/index';

export class AlertFilterDialogController extends BaseController {
  isAlertEnabled(alert: GameAlert): boolean {
    return this.settingsState.gameAlerts.isAlertEnabled(alert);
  }

  checkGroupHasEnabledAlerts(group: GameAlertGroup): boolean {
    return this.settingsState.gameAlerts.checkGroupHasEnabledAlerts(group);
  }

  checkSomeAlertsEnabled(): boolean {
    return this.settingsState.gameAlerts.checkSomeAlertsEnabled();
  }

  toggleAlert(alert: GameAlert, enabled: boolean) {
    this.settingsState.gameAlerts.toggleAlert(alert, enabled);
    this.host.requestUpdate();
  }

  toggleGroup(group: GameAlertGroup, enabled: boolean) {
    this.settingsState.gameAlerts.toggleGroup(group, enabled);
    this.host.requestUpdate();
  }

  toggleAllAlerts(enabled: boolean) {
    this.settingsState.gameAlerts.toggleAllAlerts(enabled);
    this.host.requestUpdate();
  }
}
