import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import { BaseComponent, type GameAlert } from '@shared/index';
import { COMMON_TEXTS } from '@texts/common';
import { ConfirmationAlertOpenEvent, ConfirmationAlertCloseEvent } from './events';
import { ConfirmationAlertController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-confirmation-alert')
export class ConfirmationAlert extends BaseComponent {
  static styles = styles;

  private _controller: ConfirmationAlertController;

  private _gameAlertToggleRef = createRef<SlCheckbox>();

  @state()
  private _gameAlert?: GameAlert;

  @state()
  private _gameAlertKey?: string;

  @state()
  private _message = '';

  @state()
  private _open = false;

  @state()
  private _alertToggled = true;

  @state()
  private _callback?: () => any;

  constructor() {
    super();

    this._controller = new ConfirmationAlertController(this);
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener(ConfirmationAlertOpenEvent.type, this.handleOpen);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    document.removeEventListener(ConfirmationAlertOpenEvent.type, this.handleOpen);
  }

  protected renderDesktop() {
    return html`
      <form id="confirmation-dialog" @submit=${this.handleSubmit}>
        <sl-dialog no-header ?open=${this._open} @sl-request-close=${this.handleClose}>
          <p>${this._message}</p>

          <sl-checkbox
            ref=${ref(this._gameAlertToggleRef)}
            size="small"
            name="game-alert"
            ?checked=${this._alertToggled}
            @sl-change=${this.handleToggleAlert}
          >
            ${msg('Show alerts like this in the future')}
          </sl-checkbox>

          <sl-button slot="footer" size="medium" variant="default" @click=${this.handleClose}>
            ${COMMON_TEXTS.cancel()}
          </sl-button>

          <sl-button slot="footer" size="medium" variant="danger" type="submit"> ${COMMON_TEXTS.continue()} </sl-button>
        </sl-dialog>
      </form>
    `;
  }

  private handleOpen = (event: Event) => {
    const convertedEvent = event as ConfirmationAlertOpenEvent;

    this._gameAlert = convertedEvent.gameAlert;
    this._message = convertedEvent.message;
    this._callback = convertedEvent.callback;

    if (this._controller.isGameAlertEnabled(this._gameAlert)) {
      this._open = true;
      this._alertToggled = true;
    } else {
      this._open = false;
      this._callback();
      this._callback = undefined;
    }
  };

  private handleClose = () => {
    this._open = false;

    if (this._gameAlert) {
      this.dispatchEvent(new ConfirmationAlertCloseEvent(this._gameAlert, this._gameAlertKey));
    }
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    if (this._gameAlert && this._callback) {
      this._open = false;

      if (this._gameAlertToggleRef.value) {
        this._controller.toggleGameAlert(this._gameAlert, this._alertToggled);
      }

      this._callback();
      this._callback = undefined;
    }
  };

  private handleToggleAlert = () => {
    if (this._gameAlert && this._gameAlertToggleRef.value) {
      this._alertToggled = this._gameAlertToggleRef.value.checked;
    }
  };
}
