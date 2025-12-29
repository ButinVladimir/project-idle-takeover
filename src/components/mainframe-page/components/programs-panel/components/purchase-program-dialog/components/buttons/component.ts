import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { type IProgram } from '@state/mainframe-state';
import { PurchaseProgramDialogButtonsController } from './controller';
import { BuyProgramEvent, CancelEvent } from './events';
import { PurchaseProgramDialogWarning } from './types';
import { existingProgramContext, temporaryProgramContext } from '../../contexts';
import styles from './styles';

@localized()
@customElement('ca-purchase-program-dialog-buttons')
export class PurchaseProgramDialogButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  @property({
    attribute: 'disabled',
    type: Boolean,
  })
  disabled = false;

  @consume({ context: temporaryProgramContext, subscribe: true })
  private _program?: IProgram;

  @consume({ context: existingProgramContext, subscribe: true })
  private _ownedProgram?: IProgram;

  private _controller: PurchaseProgramDialogButtonsController;

  @queryAll('p[data-warning]')
  private _warningElements!: NodeListOf<HTMLParagraphElement>;

  private _availableTimeRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new PurchaseProgramDialogButtonsController(this);
  }

  protected renderDesktop() {
    return html`
      ${this.renderWarnings()}

      <div class="buttons">
        <sl-button size="medium" variant="default" @click=${this.handleCancel}> ${COMMON_TEXTS.close()} </sl-button>

        <sl-button size="medium" variant="primary" ?disabled=${this.disabled} @click=${this.handlePurchase}>
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
      <p class="warning" data-warning=${PurchaseProgramDialogWarning.notEnoughMoney}>
        ${COMMON_TEXTS.notEnoughMoney()}
      </p>
      <p class="warning" data-warning=${PurchaseProgramDialogWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
      <p class="warning" data-warning=${PurchaseProgramDialogWarning.other}>${this.renderOtherWarnings()}</p>
    `;
  };

  private renderOtherWarnings = () => {
    if (!this._program) {
      return html`${msg('Select program')}`;
    }

    if (this._ownedProgram) {
      const formatter = this._controller.formatter;

      const formattedTier = formatter.formatTier(this._ownedProgram.tier);
      const formattedLevel = formatter.formatLevel(this._ownedProgram.level);

      return html` ${msg(str`Program is already bought with tier ${formattedTier} and level ${formattedLevel}`)} `;
    }

    return nothing;
  };

  private selectWarning(): PurchaseProgramDialogWarning | undefined {
    if (!this._program) {
      return PurchaseProgramDialogWarning.other;
    }

    const cost = this._controller.getProgramCost(this._program.name, this._program.tier, this._program.level);
    const moneyGrowth = this._controller.moneyGrowth;
    const moneyDiff = cost - this._controller.money;

    if (moneyDiff > 0) {
      if (moneyGrowth <= 0) {
        return PurchaseProgramDialogWarning.notEnoughMoney;
      }

      return PurchaseProgramDialogWarning.willBeAvailableIn;
    }

    return PurchaseProgramDialogWarning.other;
  }

  private updateAvailabilityTimer(): void {
    if (!this._availableTimeRef.value || !this._program) {
      return;
    }

    const cost = this._controller.getProgramCost(this._program.name, this._program.tier, this._program.level);
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

  private handlePurchase = () => {
    this.dispatchEvent(new BuyProgramEvent());
  };
}
