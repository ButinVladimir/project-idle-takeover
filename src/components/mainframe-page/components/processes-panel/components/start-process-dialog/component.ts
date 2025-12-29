import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import clamp from 'lodash/clamp';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { type ProgramName, type IProgram, type IProcess } from '@state/mainframe-state';
import { BaseComponent, ProgramAlert } from '@shared/index';
import { PROGRAM_TEXTS } from '@texts/index';
import { StartProcessDialogCloseEvent } from './events';
import { StartProcessDialogController } from './controller';
import { programContext, existingProcessContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-start-process-dialog')
export class StartProcessDialog extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: StartProcessDialogController;

  private _programInputRef = createRef<SlSelect>();

  private _threadsInputRef = createRef<SlInput>();

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _programName?: ProgramName = undefined;

  @state()
  private _threads = 1;

  @provide({ context: programContext })
  private _program?: IProgram;

  @provide({ context: existingProcessContext })
  private _existingProcess?: IProcess;

  constructor() {
    super();

    this._controller = new StartProcessDialogController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._programName = undefined;
      this._threads = 1;
    }
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    const maxThreads = this.calculateMaxThreads();

    const threadsInputDisabled = !(this._program && !this._program.isAutoscalable);

    const inputsContainerClasses = classMap({
      'inputs-container': true,
      desktop: desktop,
      mobile: !desktop,
    });

    const buttonsDisabled = !this.checkAvailability();

    return html`
      <form id="start-process-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Start process')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select one of owned programs to start process for it.
If you already have process for same program, old process will be replaced with new one.
Threads allow to run multiple instances of same program at same time, but additional threads require additional memory.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-select
                ${ref(this._programInputRef)}
                name="program"
                value=${this._programName ?? ''}
                hoist
                @sl-change=${this.handleProgramChange}
              >
                <span class="input-label" slot="label"> ${msg('Program')} </span>

                ${this._controller.listPrograms().map(this.formatProgramSelectItem)}
              </sl-select>

              <sl-input
                ${ref(this._threadsInputRef)}
                name="threads"
                value=${this._threads}
                type="number"
                inputmode="decimal"
                min="1"
                max=${Math.max(maxThreads, 1)}
                step="1"
                ?disabled=${threadsInputDisabled}
                @sl-change=${this.handleThreadsChange}
              >
                <span class="input-label" slot="label"> ${msg('Threads')} </span>
              </sl-input>
            </div>

            ${this._programName
              ? html`<ca-start-process-dialog-description threads=${this._threads}>
                </ca-start-process-dialog-description>`
              : nothing}
          </div>

          <ca-start-process-dialog-buttons
            slot="footer"
            ?disabled=${buttonsDisabled}
            threads=${this._threads}
            max-threads=${this.calculateMaxThreads()}
            @start-process=${this.handleSubmit}
            @cancel=${this.handleClose}
          >
          </ca-start-process-dialog-buttons>
        </sl-dialog>
      </form>
    `;
  }

  private updateContext() {
    if (this._programName) {
      this._program = this._controller.getProgram(this._programName);
      this._existingProcess = this._controller.getProcessByName(this._programName);
    } else {
      this._program = undefined;
      this._existingProcess = undefined;
    }
  }

  private handleClose = () => {
    this.dispatchEvent(new StartProcessDialogCloseEvent());
  };

  private handleProgramChange = () => {
    if (!this._programInputRef.value) {
      return;
    }

    const programName = this._programInputRef.value.value as ProgramName;
    this._programName = programName;
  };

  private handleThreadsChange = () => {
    if (!this._threadsInputRef.value) {
      return;
    }

    const threads = clamp(this._threadsInputRef.value.valueAsNumber, 1, this.calculateMaxThreads());

    this._threads = threads;
    this._threadsInputRef.value.valueAsNumber = threads;
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.checkAvailability()) {
      return;
    }

    const programIsAutoscalable = this._program!.isAutoscalable;
    const runningScalableProgram = this._controller.getRunningScalableProgram();

    const formatter = this._controller.formatter;

    const programTitle = PROGRAM_TEXTS[this._programName!].title();

    if (this._existingProcess && !programIsAutoscalable) {
      const threads = formatter.formatNumberDecimal(this._existingProcess.threads);

      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          ProgramAlert.processReplace,
          msg(
            str`Are you sure want to overwrite process for program "${programTitle}"? This will replace your current process with ${threads} threads.`,
          ),
          this.handleStartProcess,
        ),
      );
    } else if (this._existingProcess && programIsAutoscalable) {
      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          ProgramAlert.processReplace,
          msg(str`Are you sure want to overwrite process for program "${programTitle}"?`),
          this.handleStartProcess,
        ),
      );
    } else if (runningScalableProgram && programIsAutoscalable) {
      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          ProgramAlert.processReplace,
          msg(
            str`Are you sure want to replace autoscalable process? This will delete your current process for program "${programTitle}".`,
          ),
          this.handleStartProcess,
        ),
      );
    } else {
      this.handleStartProcess();
    }
  };

  private handleStartProcess = () => {
    if (this._programName) {
      const isStarted = this._controller.startProcess(this._programName, this._threads);

      if (isStarted) {
        this.dispatchEvent(new StartProcessDialogCloseEvent());
      }
    }
  };

  private formatProgramSelectItem = (program: IProgram) => {
    const formatter = this._controller.formatter;
    const programTitle = PROGRAM_TEXTS[program.name].title();
    const formattedLevel = formatter.formatLevel(program.level);
    const formattedTier = formatter.formatTier(program.tier);

    return html`<sl-option value=${program.name}>
      ${msg(str`${programTitle}, tier ${formattedTier}, level ${formattedLevel}`)}
    </sl-option>`;
  };

  private calculateMaxThreads = (): number => {
    if (!this._programName) {
      return 1;
    }

    const availableRam = this._controller.getAvailableRamForProgram(this._programName);

    if (this._program && !this._program.isAutoscalable) {
      return Math.max(Math.floor(availableRam / this._program.ram), 0);
    }

    if (availableRam > 0) {
      return 1;
    }

    return 0;
  };

  private checkAvailability = (): boolean => {
    if (!this._programName || !this._program) {
      return false;
    }

    const maxThreads = this.calculateMaxThreads();

    if (!this._program.isAutoscalable) {
      return this._threads > 0 && this._threads <= maxThreads;
    }

    return maxThreads > 0;
  };
}
