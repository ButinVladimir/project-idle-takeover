import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { msg, localized } from '@lit/localize';
import { classMap } from 'lit/directives/class-map.js';
import { BaseComponent, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import { IProcess, ProcessesBatchValidationResult, ProgramName } from '@state/mainframe-state';
import { COMMON_TEXTS, PROCESSES_BATCH_VALIDATION_TEXTS } from '@texts/index';
import { StartProcessDialogButtonsController } from './controller';
import { StartProcessEvent, CancelEvent } from './events';
import styles from './styles';

@localized()
@customElement('ca-start-process-dialog-buttons')
export class StartProcessDialogButtons extends BaseComponent {
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

  @property({
    attribute: 'max-threads',
    type: Number,
  })
  maxThreads!: number;

  @property({
    attribute: 'disabled',
    type: Boolean,
  })
  disabled = false;

  private _controller: StartProcessDialogButtonsController;

  constructor() {
    super();

    this._controller = new StartProcessDialogButtonsController(this);
  }

  protected renderDesktop() {
    const warning = this.getWarning();

    const warningClasses = classMap({
      warning: true,
      visible: !!warning,
    });

    return html`
      <p class=${warningClasses}>${warning}</p>

      <div class="buttons">
        <sl-button size="medium" variant="default" @click=${this.handleCancel}> ${COMMON_TEXTS.close()} </sl-button>

        <sl-button size="medium" variant="primary" ?disabled=${this.disabled} @click=${this.handleStart}>
          ${msg('Start processes')}
        </sl-button>
      </div>
    `;
  }

  private getWarning(): string {
    if (!this.programNames) {
      return msg('Programs are not selected');
    }

    const programNames = this.programNames.split(MULTIPLE_SELECT_SEPARATOR) as ProgramName[];

    const validationResult = this._controller.validateProcessesBatch(programNames, this.threads);

    if (validationResult !== ProcessesBatchValidationResult.valid) {
      return PROCESSES_BATCH_VALIDATION_TEXTS[validationResult]();
    }

    const runningProcesses = programNames
      .map((programName) => this._controller.getProcess(programName))
      .filter((process) => process) as IProcess[];

    if (runningProcesses.length > 0) {
      return msg('Some programs are already have processes started');
    }

    return '';
  }

  private handleCancel = () => {
    this.dispatchEvent(new CancelEvent());
  };

  private handleStart = () => {
    this.dispatchEvent(new StartProcessEvent());
  };
}
