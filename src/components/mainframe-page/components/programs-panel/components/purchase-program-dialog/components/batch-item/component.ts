import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { type ProgramName, type IProgram, ProgramValidationResult } from '@state/mainframe-state';
import { BaseComponent } from '@shared/index';
import { PROGRAM_TEXTS, PROGRAM_VALIDATION_TEXTS } from '@texts/index';
import { PurchaseProgramDialogBatchItemController } from './controller';
import { existingProgramContext, temporaryProgramContext } from './contexts';
import styles from './styles';
import { PurchaseProgramDialogBatchItemFormWarning, PurchaseProgramDialogBatchItemWarning } from './types';

@localized()
@customElement('ca-purchase-program-dialog-batch-item')
export class PurchaseProgramDialogBatchItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'program-name',
    type: String,
  })
  programName!: ProgramName;

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

  private _controller: PurchaseProgramDialogBatchItemController;

  @provide({ context: temporaryProgramContext })
  private _program?: IProgram;

  @provide({ context: existingProgramContext })
  private _existingProgram?: IProgram;

  constructor() {
    super();

    this._controller = new PurchaseProgramDialogBatchItemController(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._program?.removeAllEventListeners();
  }

  protected renderDesktop() {
    if (!this._program) {
      return nothing;
    }

    return html`
      <sl-details>
        <div slot="summary">
          <h5 class="title">${PROGRAM_TEXTS[this.programName].title()}</h5>

          <p class="warning">${this.renderWarning()}</p>
        </div>

        <article>
          <ca-purchase-program-dialog-program-description></ca-purchase-program-dialog-program-description>
        </article>
      </sl-details>
    `;
  }

  protected updateContext() {
    this._program?.removeAllEventListeners();

    this._program = this._controller.makeProgram(this.programName, this.tier, this.level);
    this._existingProgram = this._controller.getOwnedProgram(this.programName);
  }

  private renderWarning = () => {
    if (!this._program) {
      return nothing;
    }

    const warning = this.selectWarning();

    switch (warning) {
      case ProgramValidationResult.programNotAvailable:
        return PROGRAM_VALIDATION_TEXTS[warning]();
      case PurchaseProgramDialogBatchItemFormWarning.alreadyPurchased:
        return this.makeAlreadyPurchasedWarning();
      default:
        return nothing;
    }
  };

  private selectWarning(): PurchaseProgramDialogBatchItemWarning {
    const validationResult = this._controller.validateProgram(this.programName, this.tier, this.level);

    if (validationResult !== ProgramValidationResult.valid) {
      return validationResult;
    }

    if (this._existingProgram) {
      return PurchaseProgramDialogBatchItemFormWarning.alreadyPurchased;
    }

    return ProgramValidationResult.valid;
  }

  private makeAlreadyPurchasedWarning() {
    const formatter = this._controller.formatter;
    const formattedTier = formatter.formatTier(this._existingProgram!.tier);
    const formattedLevel = formatter.formatLevel(this._existingProgram!.level);

    return msg(str`Program is already bought with tier ${formattedTier} and level ${formattedLevel}`);
  }
}
