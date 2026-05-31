import { html } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import clamp from 'lodash/clamp';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { type ProgramName, type IProgram } from '@state/mainframe-state';
import { BaseComponent, compareOptions, ISelectOption, MULTIPLE_SELECT_SEPARATOR, ProgramAlert } from '@shared/index';
import { PROGRAM_TEXTS } from '@texts/index';
import { StartProcessDialogCloseEvent } from './events';
import { StartProcessDialogController } from './controller';
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
  private _programNames: ProgramName[] = [];

  @state()
  private _threads = 1;

  constructor() {
    super();

    this._controller = new StartProcessDialogController(this);
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._programNames = [];
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

    const inputsContainerClasses = classMap({
      'inputs-container': true,
      desktop: desktop,
      mobile: !desktop,
    });

    const buttonsDisabled = !this.validate();

    return html`
      <form id="start-process-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Start processes')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select programs to start processes for them.
If you already have process for same program, old process will be replaced with new one.
Threads allow to run multiple instances of same program at same time but additional threads require additional memory.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-select
                ${ref(this._programInputRef)}
                name="program"
                multiple
                clearable
                value=${this._programNames.join(MULTIPLE_SELECT_SEPARATOR)}
                hoist
                @sl-change=${this.handleProgramChange}
              >
                <span class="input-label" slot="label"> ${msg('Programs')} </span>

                ${this.renderProgramNameOptions()}
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
                @sl-change=${this.handleThreadsChange}
              >
                <span class="input-label" slot="label"> ${msg('Threads')} </span>
              </sl-input>
            </div>

            <ca-start-process-dialog-batch-description
              program-names=${this._programNames.join(MULTIPLE_SELECT_SEPARATOR)}
              threads=${this._threads}
            >
            </ca-start-process-dialog-batch-description>
          </div>

          <ca-start-process-dialog-buttons
            slot="footer"
            ?disabled=${buttonsDisabled}
            program-names=${this._programNames.join(MULTIPLE_SELECT_SEPARATOR)}
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

  private handleClose = () => {
    this.dispatchEvent(new StartProcessDialogCloseEvent());
  };

  private handleProgramChange = () => {
    if (!this._programInputRef.value) {
      return;
    }

    const programNames = this._programInputRef.value.value as ProgramName[];
    this._programNames = programNames;
  };

  private handleThreadsChange = () => {
    if (!this._threadsInputRef.value) {
      return;
    }

    const maxThreads = Math.max(this.calculateMaxThreads(), 1);
    const threads = clamp(this._threadsInputRef.value.valueAsNumber, 1, maxThreads);

    this._threads = threads;
    this._threadsInputRef.value.valueAsNumber = threads;
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.validate()) {
      return;
    }

    let replacesScalablePrograms = false;
    const runningScalableProgram = this._controller.getRunningScalableProgram();
    const replacedProgramNames: ProgramName[] = [];

    for (const programName of this._programNames) {
      const runningProcess = this._controller.getProcess(programName)!;
      const ownedProgram = this._controller.getOwnedProgram(programName);

      if (ownedProgram?.isAutoscalable) {
        replacesScalablePrograms = true;
      } else if (runningProcess) {
        replacedProgramNames.push(programName);
      }
    }

    if (replacesScalablePrograms && runningScalableProgram) {
      replacedProgramNames.push(runningScalableProgram.program.name);
    }

    if (replacedProgramNames.length > 0) {
      const programTitles = replacedProgramNames.map((programName) => `"${PROGRAM_TEXTS[programName].title()}"`);

      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          ProgramAlert.processReplace,
          msg(str`Are you sure want to replace processes for programs ${programTitles.join()}?`),
          this.handleStartProcess,
        ),
      );
    } else {
      this.handleStartProcess();
    }
  };

  private handleStartProcess = () => {
    if (this._programNames) {
      const isStarted = this._controller.startProcesses(this._programNames, this._threads);

      if (isStarted) {
        this.dispatchEvent(new StartProcessDialogCloseEvent());
      }
    }
  };

  private renderProgramNameOptions = () => {
    const programs = this._controller.listPrograms();
    const programOptions: ISelectOption[] = programs.map(this.formatProgramSelectItem);
    programOptions.sort(compareOptions);

    return programOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private formatProgramSelectItem = (program: IProgram): ISelectOption => {
    const formatter = this._controller.formatter;
    const programTitle = PROGRAM_TEXTS[program.name].title();
    const formattedLevel = formatter.formatLevel(program.level);
    const formattedTier = formatter.formatTier(program.tier);

    return {
      value: program.name,
      name: msg(str`${programTitle}, tier ${formattedTier}, level ${formattedLevel}`),
    };
  };

  private calculateMaxThreads = (): number => {
    if (!this._programNames) {
      return 1;
    }

    let availableRam = this._controller.availableRam;
    let hasAutoscalableProcesses = false;
    let ramPerThread = 0;

    for (const programName of this._programNames) {
      const ownedProgram = this._controller.getOwnedProgram(programName);

      if (!ownedProgram) {
        continue;
      }

      if (ownedProgram.isAutoscalable) {
        hasAutoscalableProcesses = true;
        availableRam -= ownedProgram.ram;
      } else {
        const runningProcess = this._controller.getProcess(programName);

        if (runningProcess) {
          availableRam += runningProcess.usedRam;
        }

        ramPerThread += ownedProgram.ram;
      }
    }

    if (hasAutoscalableProcesses) {
      const runningAutoscalableProcess = this._controller.getRunningScalableProgram();

      if (runningAutoscalableProcess) {
        availableRam += runningAutoscalableProcess.program.ram;
      }
    }

    if (ramPerThread === 0) {
      return 1;
    }

    return Math.max(Math.floor(availableRam / ramPerThread), 1);
  };

  private validate = (): boolean => {
    return this._controller.validateProcesses(this._programNames, this._threads);
  };
}
