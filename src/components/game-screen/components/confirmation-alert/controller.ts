import { BaseController, GameAlert } from '@shared/index';

export class ConfirmationAlertController extends BaseController {
  isGameAlertEnabled(gameAlert: GameAlert): boolean {
    return this.settingsState.gameAlerts.isAlertEnabled(gameAlert);
  }

  toggleGameAlert(gameAlert: GameAlert, enabled: boolean) {
    this.settingsState.gameAlerts.toggleAlert(gameAlert, enabled);
  }
}
