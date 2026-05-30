import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';
import { createRef, ref } from 'lit/directives/ref.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { MainframeHardwarePanelButtonsController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-mainframe-hardware-panel-buttons')
export class MainframeHardwarePanelButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: MainframeHardwarePanelButtonsController;

  private _buyMaxButtonRef = createRef<SlButton>();

  constructor() {
    super();

    this._controller = new MainframeHardwarePanelButtonsController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-tooltip trigger="click">
        <div class="hotkeys-content" slot="content">
          <p>
            ${COMMON_TEXTS.parameterRow(
              msg('Upgrade max all enabled mainframe hardware'),
              COMMON_TEXTS.hotkeyValue(this._controller.getUpgradeMainframeHardwareHotkey()),
            )}
          </p>
          <p>
            ${COMMON_TEXTS.parameterRow(
              msg('Upgrade max mainframe performace'),
              COMMON_TEXTS.hotkeyValue(this._controller.getUpgradeMainframePerformanceHotkey()),
            )}
          </p>
          <p>
            ${COMMON_TEXTS.parameterRow(
              msg('Upgrade max mainframe RAM'),
              COMMON_TEXTS.hotkeyValue(this._controller.getUpgradeMainframeRamHotkey()),
            )}
          </p>
          <p>
            ${COMMON_TEXTS.parameterRow(
              msg('Upgrade max mainframe cores'),
              COMMON_TEXTS.hotkeyValue(this._controller.getUpgradeMainframeCoresHotkey()),
            )}
          </p>
        </div>

        <sl-button variant="default" size="medium"> ${COMMON_TEXTS.showHotkeys()} </sl-button>
      </sl-tooltip>

      <sl-button
        ${ref(this._buyMaxButtonRef)}
        variant="default"
        type="button"
        size="medium"
        @click=${this.handleBuyMax}
      >
        ${COMMON_TEXTS.upgradeDisplayedEnabledItems()}
      </sl-button>
    `;
  }

  private handleBuyMax = () => {
    this._controller.purchaseMax();
  };

  handlePartialUpdate = () => {
    if (this._buyMaxButtonRef.value) {
      const buttonDisabled = !this._controller.checkCanPurchaseMax();

      this._buyMaxButtonRef.value.disabled = buttonDisabled;
    }
  };
}
