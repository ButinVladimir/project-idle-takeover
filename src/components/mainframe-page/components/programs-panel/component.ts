import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import styles from './styles';
import { MainframeProgramsPanelController } from './controller';

@localized()
@customElement('ca-mainframe-programs-panel')
export class MainframeProgramsPanel extends BaseComponent {
  static styles = styles;

  @state()
  private _isPurchaseProgramDialogOpen = false;

  private _controller: MainframeProgramsPanelController;

  constructor() {
    super();

    this._controller = new MainframeProgramsPanelController(this);
  }

  protected renderDesktop() {
    const upgradeProgramsHotkey = this._controller.getUpgradeProgramsHotkey();

    return html`
      <p class="hint">
        ${msg(`Program autoupgrade priority can be changed by dragging it by the title if filter is disabled.
Programs on top have higher priority.
Autoupgrade for programs won't change their tier but will attempt to increase level.
Program level cannot be above development level.`)}
      </p>

      <div class="buttons">
        <sl-tooltip trigger="click">
          <div slot="content">
            <p>
              ${COMMON_TEXTS.parameterRow(
                msg('Upgrade all enabled programs'),
                COMMON_TEXTS.hotkeyValue(upgradeProgramsHotkey),
              )}
            </p>
          </div>

          <sl-button variant="default" size="medium"> ${COMMON_TEXTS.showHotkeys()} </sl-button>
        </sl-tooltip>

        <sl-button variant="primary" size="medium" @click=${this.handlePurchaseProgramsDialogOpen}>
          ${msg('Purchase programs')}
        </sl-button>
      </div>

      <ca-owned-programs-list></ca-owned-programs-list>

      <ca-purchase-program-dialog
        ?open=${this._isPurchaseProgramDialogOpen}
        @purchase-program-dialog-close=${this.handlePurchaseProgramDialogClose}
      >
      </ca-purchase-program-dialog>
    `;
  }

  private handlePurchaseProgramsDialogOpen = () => {
    this._isPurchaseProgramDialogOpen = true;
  };

  private handlePurchaseProgramDialogClose = () => {
    this._isPurchaseProgramDialogOpen = false;
  };
}
