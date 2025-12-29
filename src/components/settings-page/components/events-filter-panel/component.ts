import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import styles from './styles';

@localized()
@customElement('ca-events-filter-panel')
export class EventsFilterPanel extends BaseComponent {
  static styles = styles;

  @state()
  private _messageFilterOpen = false;

  @state()
  private _alertFilterOpen = false;

  @state()
  private _notificationTypeFilterOpen = false;

  @state()
  private _hotkeysDialogOpen = false;

  protected renderDesktop() {
    return html`
      <div class="buttons-list">
        <sl-button variant="default" size="medium" @click=${this.handleMessageFilterDialogOpen}>
          <sl-icon slot="prefix" name="chat-left-dots"></sl-icon>
          ${msg('Message filter')}
        </sl-button>

        <sl-button variant="default" size="medium" @click=${this.handleAlertFilterDialogOpen}>
          <sl-icon slot="prefix" name="question-circle"></sl-icon>
          ${msg('Alert filter')}
        </sl-button>

        <sl-button variant="default" size="medium" @click=${this.handleNotificationTypeFilterDialogOpen}>
          <sl-icon slot="prefix" name="exclamation-circle"></sl-icon>
          ${msg('Notification type filter')}
        </sl-button>

        <sl-button variant="default" size="medium" @click=${this.handleHotkeysDialogOpen}>
          <sl-icon slot="prefix" name="keyboard"></sl-icon>
          ${msg('Hotkeys')}
        </sl-button>
      </div>

      <ca-message-filter-dialog
        ?open=${this._messageFilterOpen}
        @message-filter-dialog-close=${this.handleMessageFilterDialogClose}
      >
      </ca-message-filter-dialog>

      <ca-alert-filter-dialog
        ?open=${this._alertFilterOpen}
        @alert-filter-dialog-close=${this.handleAlertFilterDialogClose}
      >
      </ca-alert-filter-dialog>

      <ca-notification-type-filter-dialog
        ?open=${this._notificationTypeFilterOpen}
        @notification-type-filter-dialog-close=${this.handleNotificationTypeFilterDialogClose}
      >
      </ca-notification-type-filter-dialog>

      <ca-hotkeys-dialog ?open=${this._hotkeysDialogOpen} @hotkeys-dialog-close=${this.handleHotkeysDialogClose}>
      </ca-hotkeys-dialog>
    `;
  }

  private handleMessageFilterDialogOpen = () => {
    this._messageFilterOpen = true;
  };

  private handleMessageFilterDialogClose = () => {
    this._messageFilterOpen = false;
  };

  private handleAlertFilterDialogOpen = () => {
    this._alertFilterOpen = true;
  };

  private handleAlertFilterDialogClose = () => {
    this._alertFilterOpen = false;
  };

  private handleNotificationTypeFilterDialogOpen = () => {
    this._notificationTypeFilterOpen = true;
  };

  private handleNotificationTypeFilterDialogClose = () => {
    this._notificationTypeFilterOpen = false;
  };

  private handleHotkeysDialogOpen = () => {
    this._hotkeysDialogOpen = true;
  };

  private handleHotkeysDialogClose = () => {
    this._hotkeysDialogOpen = false;
  };
}
