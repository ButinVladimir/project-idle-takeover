import { html } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { BaseComponent, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import { COMMON_TEXTS, PROGRAMS_BATCH_VALIDATION_TEXTS } from '@texts/index';
import { ProgramName, ProgramsBatchValidationResult } from '@state/mainframe-state';
import { PurchaseProgramDialogButtonsController } from './controller';
import { BuyProgramEvent, CancelEvent } from './events';
import { PurchaseProgramDialogFormWarning, PurchaseProgramDialogWarning } from './types';
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

  @property({
    attribute: 'program-names',
    type: String,
  })
  programNames!: string;

  @property({
    attribute: 'tier',
    type: Number,
  })
  tier!: number;

  @property({
    attribute: 'level',
    type: Number,
  })
  level!: number;

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
      <p class="warning" data-warning=${PurchaseProgramDialogFormWarning.notSelected}>
        ${msg('Programs are not selected')}
      </p>
      <p class="warning" data-warning=${ProgramsBatchValidationResult.programsLocked}>
        ${PROGRAMS_BATCH_VALIDATION_TEXTS.programsLocked()}
      </p>
      <p class="warning" data-warning=${ProgramsBatchValidationResult.programsNotAvailable}>
        ${PROGRAMS_BATCH_VALIDATION_TEXTS.programsNotAvailable()}
      </p>
      <p class="warning" data-warning=${ProgramsBatchValidationResult.notEnoughMoney}>
        ${PROGRAMS_BATCH_VALIDATION_TEXTS.notEnoughMoney()}
      </p>
      <p class="warning" data-warning=${PurchaseProgramDialogFormWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
      <p class="warning" data-warning=${PurchaseProgramDialogFormWarning.alreadyPurchased}>
        ${msg(str`Some programs are already purchased`)}
      </p>
    `;
  };

  private selectWarning(): PurchaseProgramDialogWarning {
    if (!this.programNames) {
      return PurchaseProgramDialogFormWarning.notSelected;
    }

    const programNames = this.programNames.split(MULTIPLE_SELECT_SEPARATOR) as ProgramName[];

    const validationResult = this._controller.validateProgramsBatch(programNames, this.tier, this.level);

    if (validationResult === ProgramsBatchValidationResult.notEnoughMoney) {
      const moneyGrowth = this._controller.moneyGrowth;

      if (moneyGrowth <= 0) {
        return ProgramsBatchValidationResult.notEnoughMoney;
      }

      return PurchaseProgramDialogFormWarning.willBeAvailableIn;
    }

    const hasOwnedPrograms = programNames.some((programName) => this._controller.getOwnedProgram(programName));

    if (validationResult === ProgramsBatchValidationResult.valid && hasOwnedPrograms) {
      return PurchaseProgramDialogFormWarning.alreadyPurchased;
    }

    return validationResult;
  }

  private updateAvailabilityTimer(): void {
    if (!this._availableTimeRef.value || !this.programNames) {
      return;
    }

    const programNames = this.programNames.split(MULTIPLE_SELECT_SEPARATOR) as ProgramName[];

    const totalCost = this.getTotalCost(programNames);
    const moneyGrowth = this._controller.moneyGrowth;
    const moneyDiff = totalCost - this._controller.money;

    if (moneyDiff <= 0 || moneyGrowth <= 0) {
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

  private getTotalCost(programNames: ProgramName[]) {
    return programNames.reduce(
      (sum, programName) => sum + this._controller.getProgramCost(programName, this.tier, this.level),
      0,
    );
  }
}
