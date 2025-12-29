import { html, nothing } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { msg, localized } from '@lit/localize';
import { consume } from '@lit/context';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { type IClone } from '@state/clones-state';
import { PurchaseCloneDialogButtonsController } from './controller';
import { CancelEvent, PurchaseCloneEvent } from './events';
import { temporaryCloneContext } from '../../contexts';
import { PurchaseCloneDialogWarning } from './types';
import styles from './styles';

@localized()
@customElement('ca-purchase-clone-dialog-buttons')
export class PurchaseCloneDialogButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: PurchaseCloneDialogButtonsController;

  @consume({ context: temporaryCloneContext, subscribe: true })
  private _clone?: IClone;

  @queryAll('p[data-warning]')
  private _warningElements!: NodeListOf<HTMLParagraphElement>;

  @property({
    attribute: 'disabled',
    type: Boolean,
  })
  disabled = false;

  private _purchaseButtonRef = createRef<SlButton>();

  private _availableTimeRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new PurchaseCloneDialogButtonsController(this);
  }

  protected renderDesktop() {
    return html`
      ${this.renderWarnings()}

      <div class="buttons">
        <sl-button size="medium" variant="default" @click=${this.handleCancel}> ${COMMON_TEXTS.close()} </sl-button>

        <sl-button
          ${ref(this._purchaseButtonRef)}
          size="medium"
          variant="primary"
          ?disabled=${this.disabled}
          @click=${this.handlePurchaseClone}
        >
          ${COMMON_TEXTS.purchase()}
        </sl-button>
      </div>
    `;
  }

  handlePartialUpdate = () => {
    const warning = this.selectWarning();
    this._warningElements.forEach((warningElement) => {
      if (warningElement.dataset.warning === warning) {
        warningElement.classList.add('visible');
      } else {
        warningElement.classList.remove('visible');
      }
    });

    this.updateAvailabilityTimer();
  };

  private renderWarnings = () => {
    return html`
      <p class="warning" data-warning=${PurchaseCloneDialogWarning.notEnoughMoney}>${COMMON_TEXTS.notEnoughMoney()}</p>
      <p class="warning" data-warning=${PurchaseCloneDialogWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
      <p class="warning" data-warning=${PurchaseCloneDialogWarning.other}>${this.renderOtherWarnings()}</p>
    `;
  };

  private renderOtherWarnings = () => {
    if (!this._clone) {
      return msg('Select clone template name');
    }

    if (!this._clone.name) {
      return msg('Enter clone name');
    }

    const synchronization = this._controller.getCloneSynchronization(this._clone.templateName, this._clone.tier);
    if (synchronization > this._controller.availableSynchronization) {
      return msg('Not enough synchronization');
    }

    return nothing;
  };

  private selectWarning(): PurchaseCloneDialogWarning | undefined {
    if (!this._clone) {
      return PurchaseCloneDialogWarning.other;
    }

    const cost = this._controller.getCloneCost(this._clone.templateName, this._clone.tier, this._clone.level);
    const moneyGrowth = this._controller.moneyGrowth;
    const moneyDiff = cost - this._controller.money;

    if (moneyDiff > 0) {
      if (moneyGrowth <= 0) {
        return PurchaseCloneDialogWarning.notEnoughMoney;
      }

      return PurchaseCloneDialogWarning.willBeAvailableIn;
    }

    return PurchaseCloneDialogWarning.other;
  }

  private updateAvailabilityTimer(): void {
    if (!this._clone) {
      return;
    }

    if (!this._availableTimeRef.value) {
      return;
    }

    const cost = this._controller.getCloneCost(this._clone.templateName, this._clone.tier, this._clone.level);
    const moneyGrowth = this._controller.moneyGrowth;
    const moneyDiff = cost - this._controller.money;

    if (moneyDiff < 0 || moneyGrowth < 0) {
      this._availableTimeRef.value.textContent = '';
    } else {
      const formattedTime = this._controller.formatter.formatTimeLong(moneyDiff / moneyGrowth);
      this._availableTimeRef.value.textContent = formattedTime;
    }
  }

  private handleCancel = () => {
    this.dispatchEvent(new CancelEvent());
  };

  private handlePurchaseClone = () => {
    this.dispatchEvent(new PurchaseCloneEvent());
  };
}
