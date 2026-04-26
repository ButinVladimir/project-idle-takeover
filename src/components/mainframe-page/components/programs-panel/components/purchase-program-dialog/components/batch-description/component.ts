import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { BaseComponent, getHighlightValueClass, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { ProgramName } from '@state/mainframe-state';
import { PurchaseProgramDialogBatchDescriptionController } from './controller';
import styles from './styles';
import { repeat } from 'lit/directives/repeat.js';

@localized()
@customElement('ca-purchase-program-dialog-batch-description')
export class PurchaseProgramDialogButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

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

  private _controller: PurchaseProgramDialogBatchDescriptionController;

  private _costElRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new PurchaseProgramDialogBatchDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this.programNames) {
      return nothing;
    }

    const programNames = this.programNames.split(MULTIPLE_SELECT_SEPARATOR) as ProgramName[];

    return html`
      <p class="text">
        ${COMMON_TEXTS.parameterRow(COMMON_TEXTS.totalCost(), html`<span ${ref(this._costElRef)}></span>`)}
      </p>

      ${repeat(
        programNames,
        (programName) => programName,
        (programName) =>
          html`<ca-purchase-program-dialog-batch-item
            program-name=${programName}
            tier=${this.tier}
            level=${this.level}
          ></ca-purchase-program-dialog-batch-item>`,
      )}
    `;
  }

  handlePartialUpdate = () => {
    if (!this._costElRef.value) {
      return;
    }

    let totalCost = 0;

    if (this.programNames) {
      const names = this.programNames.split(MULTIPLE_SELECT_SEPARATOR) as ProgramName[];
      totalCost = names.reduce(
        (sum, programName) => sum + this._controller.getProgramCost(programName, this.tier, this.level),
        0,
      );
    }

    const money = this._controller.money;

    const formattedTotalCost = this._controller.formatter.formatNumberFloat(totalCost);
    const className = getHighlightValueClass(money >= totalCost);

    this._costElRef.value.textContent = formattedTotalCost;
    this._costElRef.value.className = className;
  };
}
