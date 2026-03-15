import { html } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { msg, localized } from '@lit/localize';
import { consume } from '@lit/context';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { BaseComponent } from '@shared/index';
import { CLONE_VALIDATION_TEXTS, COMMON_TEXTS } from '@texts/index';
import { CloneValidationResult, type IClone } from '@state/clones-state';
import { PurchaseCloneDialogButtonsController } from './controller';
import { CancelEvent, PurchaseCloneEvent } from './events';
import { temporaryCloneContext } from '../../contexts';
import { PurchaseCloneDialogFormWarning, PurchaseCloneDialogWarning } from './types';
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
      <p class="warning" data-warning=${PurchaseCloneDialogFormWarning.cloneTemplateNotSelected}>
        ${msg('Select clone template name')}
      </p>
      <p class="warning" data-warning=${CloneValidationResult.cloneNotAvailable}>
        ${CLONE_VALIDATION_TEXTS.cloneNotAvailable()}
      </p>
      <p class="warning" data-warning=${CloneValidationResult.companyLocked}>
        ${CLONE_VALIDATION_TEXTS.companyLocked()}
      </p>
      <p class="warning" data-warning=${CloneValidationResult.nameEmpty}>${CLONE_VALIDATION_TEXTS.nameEmpty()}</p>
      <p class="warning" data-warning=${CloneValidationResult.notEnoughMoney}>
        ${CLONE_VALIDATION_TEXTS.notEnoughMoney()}
      </p>
      <p class="warning" data-warning=${CloneValidationResult.notEnoughSynchronization}>
        ${CLONE_VALIDATION_TEXTS.notEnoughSynchronization()}
      </p>
      <p class="warning" data-warning=${PurchaseCloneDialogFormWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
    `;
  };

  private selectWarning(): PurchaseCloneDialogWarning {
    if (!this._clone) {
      return PurchaseCloneDialogFormWarning.cloneTemplateNotSelected;
    }

    const validationResult = this._controller.validateClone(this._clone);

    if (validationResult === CloneValidationResult.notEnoughMoney) {
      const cost = this._controller.getCloneCost(this._clone.templateName, this._clone.tier, this._clone.level);
      const moneyGrowth = this._controller.moneyGrowth;
      const moneyDiff = cost - this._controller.money;

      if (moneyDiff > 0) {
        if (moneyGrowth <= 0) {
          return CloneValidationResult.notEnoughMoney;
        }

        return PurchaseCloneDialogFormWarning.willBeAvailableIn;
      }
    }

    return validationResult;
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
