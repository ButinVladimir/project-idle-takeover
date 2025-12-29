import { GameAlert } from '@shared/types';

export class ConfirmationAlertOpenEvent extends Event {
  static readonly type = 'confirmation-alert-open';

  readonly gameAlert: GameAlert;
  readonly message: string;
  readonly callback: () => any;

  constructor(gameAlert: GameAlert, message: string, callback: () => any) {
    super(ConfirmationAlertOpenEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.gameAlert = gameAlert;
    this.message = message;
    this.callback = callback;
  }
}
