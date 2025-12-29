import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { localized } from '@lit/localize';
import { createRef, ref } from 'lit/directives/ref.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { MainframeHardwarePanelButtonsController } from './controller';
import styles from '../../styles';

@localized()
@customElement('ca-mainframe-hardware-panel-buttons')
export class MainframeHardwarePanelButtons extends BaseComponent {
  static style = styles;

  hasPartialUpdate = true;

  private _controller: MainframeHardwarePanelButtonsController;

  private _buyMaxButtonRef = createRef<SlButton>();

  constructor() {
    super();

    this._controller = new MainframeHardwarePanelButtonsController(this);
  }

  protected renderDesktop() {
    const hotkey = this._controller.getHotkey();

    return html`
      <sl-tooltip>
        <span slot="content">${COMMON_TEXTS.hotkey(hotkey)}</span>
        <sl-button
          ${ref(this._buyMaxButtonRef)}
          variant="default"
          type="button"
          size="medium"
          @click=${this.handleBuyMax}
        >
          ${COMMON_TEXTS.upgradeAll()}
        </sl-button>
      </sl-tooltip>
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
