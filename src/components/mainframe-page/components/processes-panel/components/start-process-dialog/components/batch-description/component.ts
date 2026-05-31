import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent, getHighlightValueClassMap, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS } from '@texts/index';
import { ProgramName } from '@state/mainframe-state';
import { StartProcessDialogBatchDescriptionController } from './controller';
import styles from './styles';
import { repeat } from 'lit/directives/repeat.js';

@localized()
@customElement('ca-start-process-dialog-batch-description')
export class StartProcessDialohBatchDescription extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'program-names',
    type: String,
  })
  programNames!: string;

  @property({
    attribute: 'threads',
    type: Number,
  })
  threads!: number;

  private _controller: StartProcessDialogBatchDescriptionController;

  constructor() {
    super();

    this._controller = new StartProcessDialogBatchDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this.programNames) {
      return nothing;
    }

    const programNames = this.programNames.split(MULTIPLE_SELECT_SEPARATOR) as ProgramName[];

    const formatter = this._controller.formatter;

    const availableRam = this._controller.getAvailableRamForPrograms(programNames);
    const requiredRam = this._controller.getRequiredRamForPrograms(programNames, this.threads);

    const formattedAvailableRam = formatter.formatNumberDecimal(availableRam);
    const formattedRequiredRam = formatter.formatNumberDecimal(requiredRam);

    const ramClass = getHighlightValueClassMap(availableRam >= requiredRam);
    const ramEl = html`<span class=${ramClass}>${formattedRequiredRam} / ${formattedAvailableRam}</span>`;

    return html`
      <p>${COMMON_TEXTS.parameterRow(PROGRAM_DESCRIPTION_TEXTS.requiredRam(), ramEl)}</p>

      ${repeat(
        programNames,
        (programName) => programName,
        (programName) =>
          html`<ca-start-process-dialog-batch-item
            program-name=${programName}
            threads=${this.threads}
          ></ca-start-process-dialog-batch-item>`,
      )}
    `;
  }
}
