import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { type ProgramName, type IProgram, type IProcess, ProcessValidationResult } from '@state/mainframe-state';
import { BaseComponent } from '@shared/index';
import { PROCESS_VALIDATION_TEXTS, PROGRAM_TEXTS } from '@texts/index';
import { PurchaseProgramDialogBatchItemController } from './controller';
import { existingProcessContext, programContext } from './contexts';
import styles from './styles';
import { StartProcessDialogBatchItemFormWarning, StartProcessDialogBatchItemWarning } from './types';

@localized()
@customElement('ca-start-process-dialog-batch-item')
export class StartProcessDialogBatchItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'program-name',
    type: String,
  })
  programName!: ProgramName;

  @property({
    attribute: 'threads',
    type: Number,
  })
  threads!: number;

  private _controller: PurchaseProgramDialogBatchItemController;

  @provide({ context: programContext })
  private _ownedProgram?: IProgram;

  @provide({ context: existingProcessContext })
  private _existingProcess?: IProcess;

  constructor() {
    super();

    this._controller = new PurchaseProgramDialogBatchItemController(this);
  }

  protected renderDesktop() {
    if (!this._ownedProgram) {
      return nothing;
    }

    return html`
      <sl-details>
        <div slot="summary">
          <h5 class="title">${PROGRAM_TEXTS[this.programName].title()}</h5>

          <p class="warning">${this.renderWarning()}</p>
        </div>

        <article>
          <ca-start-process-dialog-process-description
            threads=${this.threads}
          ></ca-start-process-dialog-process-description>
        </article>
      </sl-details>
    `;
  }

  protected updateContext() {
    if (this.programName) {
      this._ownedProgram = this._controller.getOwnedProgram(this.programName);
      this._existingProcess = this._controller.getProcessByName(this.programName);
    } else {
      this._ownedProgram = undefined;
      this._existingProcess = undefined;
    }
  }

  private renderWarning = () => {
    if (!this._ownedProgram) {
      return nothing;
    }

    const warning = this.selectWarning();

    switch (warning) {
      case ProcessValidationResult.programNotOwned:
      case ProcessValidationResult.threadsInvalid:
        return PROCESS_VALIDATION_TEXTS[warning];
      case StartProcessDialogBatchItemFormWarning.alreadyStarted:
        return this.makeAlreadyStartedWarning();
      case StartProcessDialogBatchItemFormWarning.autoscalableProcessAlreadyStarted:
        return msg('Process for another autoscalable program has already been started');
      default:
        return nothing;
    }
  };

  private selectWarning(): StartProcessDialogBatchItemWarning {
    const validationResult = this._controller.validateProcess(this.programName, this.threads);

    if (validationResult !== ProcessValidationResult.valid) {
      return validationResult;
    }

    if (this._existingProcess) {
      return StartProcessDialogBatchItemFormWarning.alreadyStarted;
    }

    const runningAutoscalableProcess = this._controller.getRunningAutoscalableProcess();

    if (this._ownedProgram?.isAutoscalable && runningAutoscalableProcess) {
      return StartProcessDialogBatchItemFormWarning.autoscalableProcessAlreadyStarted;
    }

    return ProcessValidationResult.valid;
  }

  private makeAlreadyStartedWarning() {
    if (this._existingProcess!.program.isAutoscalable) {
      return msg(str`Process for program is already started`);
    }

    const formatter = this._controller.formatter;
    const formattedThreads = formatter.formatNumberDecimal(this._existingProcess!.threads);

    return msg(str`Process for program is already started with threads ${formattedThreads}`);
  }
}
