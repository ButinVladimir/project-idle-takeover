import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_VALIDATION_TEXTS } from '@texts/index';
import { ProgramValidationResult, type IProgram } from '@state/mainframe-state';
import { PurchaseProgramDialogButtonsController } from './controller';
import { BuyProgramEvent, CancelEvent, RestoreValuesEvent } from './events';
import { PurchaseProgramDialogFormWarning, PurchaseProgramDialogWarning } from './types';
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

        <sl-button size="medium" variant="default" ?disabled=${!this._ownedProgram} @click=${this.handleRestoreValues}>
          ${COMMON_TEXTS.restoreValues()}
        </sl-button>

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
      <p class="warning" data-warning=${PurchaseProgramDialogFormWarning.notSelected}>${msg('Select program')}</p>
      <p class="warning" data-warning=${ProgramValidationResult.programsLocked}>
        ${PROGRAM_VALIDATION_TEXTS.programsLocked()}
      </p>
      <p class="warning" data-warning=${ProgramValidationResult.programNotAvailable}>
        ${PROGRAM_VALIDATION_TEXTS.programNotAvailable()}
      </p>
      <p class="warning" data-warning=${ProgramValidationResult.notEnoughMoney}>
        ${PROGRAM_VALIDATION_TEXTS.notEnoughMoney()}
      </p>
      <p class="warning" data-warning=${PurchaseProgramDialogFormWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
      ${this.renderAlreadyPurchasedWarning()}
    `;
  };

  private renderAlreadyPurchasedWarning = () => {
    if (!this._ownedProgram) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const formattedTier = formatter.formatTier(this._ownedProgram!.tier);
    const formattedLevel = formatter.formatLevel(this._ownedProgram!.level);

    return html`
      <p class="warning" data-warning=${PurchaseProgramDialogFormWarning.alreadyPurchased}>
        ${msg(str`Program is already bought with tier ${formattedTier} and level ${formattedLevel}`)}
      </p>
    `;
  };

  private selectWarning(): PurchaseProgramDialogWarning {
    if (!this._program) {
      return PurchaseProgramDialogFormWarning.notSelected;
    }

    const validationResult = this._controller.validateProgram(
      this._program.name,
      this._program.tier,
      this._program.level,
    );

    if (validationResult === ProgramValidationResult.notEnoughMoney) {
      const cost = this._controller.getProgramCost(this._program.name, this._program.tier, this._program.level);
      const moneyGrowth = this._controller.moneyGrowth;
      const moneyDiff = cost - this._controller.money;

      if (moneyDiff > 0) {
        if (moneyGrowth <= 0) {
          return ProgramValidationResult.notEnoughMoney;
        }

        return PurchaseProgramDialogFormWarning.willBeAvailableIn;
      }
    }

    if (validationResult === ProgramValidationResult.valid && this._ownedProgram) {
      return PurchaseProgramDialogFormWarning.alreadyPurchased;
    }

    return validationResult;
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

  private handleRestoreValues = () => {
    this.dispatchEvent(new RestoreValuesEvent());
  };

  private handlePurchase = () => {
    this.dispatchEvent(new BuyProgramEvent());
  };
}
