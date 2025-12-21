import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, GameStateAlert, Hotkey, HOTKEYS } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { HotkeysDialogCloseEvent } from './events';
import { HotkeysDialogController } from './controller';
import { HOTKEY_NAMES } from './constants';
import styles from './styles';

@localized()
@customElement('ca-hotkeys-dialog')
export class HotkeysDialog extends BaseComponent {
  static styles = styles;

  private _controller: HotkeysDialogController;

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _currentHotkey?: Hotkey;

  constructor() {
    super();

    this._controller = new HotkeysDialogController(this);
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._currentHotkey = undefined;
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('keydown', this.handleKeyDown);
  }

  protected renderDesktop() {
    return html`
      <form id="hotkeys-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Hotkeys')}</h4>

          <div class="body">
            <p class="hint">
              ${msg('Hotkeys for most used actions. Press button on form and then pressed key to assign hotkey.')}
            </p>

            <div class="buttons-container">
              <sl-button variant="danger" size="medium" @click=${this.handleOpenUnassignConfirmationModal}>
                ${msg('Clear hotkeys')}
              </sl-button>
              <sl-button variant="default" size="medium" @click=${this.handleOpenRestoreConfirmationModal}>
                ${msg('Restore default hotkeys')}
              </sl-button>
            </div>

            <sl-divider></sl-divider>

            <div class="hotkey-table">${repeat(HOTKEYS, this.renderHotkeyRow)}</div>
          </div>

          <sl-button slot="footer" size="medium" variant="default" @click=${this.handleClose}>
            ${COMMON_TEXTS.close()}
          </sl-button>
        </sl-dialog>
      </form>
    `;
  }

  private renderHotkeyRow = (hotkey: Hotkey) => {
    let buttonText: string;
    let buttonVariant: 'default' | 'primary';

    if (this._currentHotkey === hotkey) {
      buttonText = msg('Press key to assign');
      buttonVariant = 'primary';
    } else {
      buttonText = this._controller.getKeyByHotkey(hotkey)?.toLocaleUpperCase() ?? msg('No button assigned');
      buttonVariant = 'default';
    }

    return html`
      <div>${HOTKEY_NAMES[hotkey]()}</div>
      <div class="hotkey-button-container">
        <sl-button
          size="small"
          variant=${buttonVariant}
          value=${hotkey}
          @click=${this.handleStartAssigningHotkey}
          @sl-blur=${this.handleStopAssigningHotkey}
        >
          ${buttonText}
        </sl-button>
      </div>
    `;
  };

  private handleClose = () => {
    this.dispatchEvent(new HotkeysDialogCloseEvent());
  };

  private handleOpenUnassignConfirmationModal = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        GameStateAlert.unassignHotkeys,
        msg('Are you sure want to unassign all hotkeys?'),
        this.handleUnassignHotkeys,
      ),
    );
  };

  private handleUnassignHotkeys = () => {
    this._controller.unassignHotkeys();
  };

  private handleOpenRestoreConfirmationModal = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        GameStateAlert.restoreDefaultHotkeys,
        msg('Are you sure want to restore default hotkeys?'),
        this.handleRestoreHotkeys,
      ),
    );
  };

  private handleRestoreHotkeys = () => {
    this._controller.restoreDefaultHotkeys();
  };

  private handleStopAssigningHotkey = () => {
    this._currentHotkey = undefined;
  };

  private handleStartAssigningHotkey = (event: Event) => {
    const target = event.target as SlButton;
    const hotkey = target.value as Hotkey;

    this._currentHotkey = hotkey;
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this._currentHotkey || !event.key) {
      return;
    }

    event.stopPropagation();

    const key = event.key;

    this._controller.setHotkey(this._currentHotkey, key);

    this._currentHotkey = undefined;
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();
  };
}
