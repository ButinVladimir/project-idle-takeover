import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { ProcessesPanelController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-mainframe-processes-panel')
export class MainframeProcessesPanel extends BaseComponent {
  static styles = styles;

  hasMobileRender = true;

  private _controller: ProcessesPanelController;

  @state()
  private _isStartProcessDialogOpen = false;

  constructor() {
    super();

    this._controller = new ProcessesPanelController(this);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    const formatter = this._controller.formatter;

    const formattedAvailableRam = formatter.formatNumberDecimal(this._controller.availableRam);
    const formattedMaxRam = formatter.formatNumberDecimal(this._controller.maxRam);

    const formattedAvailableCores = formatter.formatNumberDecimal(this._controller.availableCores);
    const formattedMaxCores = formatter.formatNumberDecimal(this._controller.maxCores);

    const topContainerClasses = classMap({
      'top-container': true,
      desktop: desktop,
      mobile: !desktop,
    });

    return html`
      <p class="hint">
        ${msg(`To make a program run, a process has to be start for it.
1 core is always assigned to autoscalable program if process for it is active.
Topmost processes for non-autoscalable programs have more priority when cores are assigned to processes.
After that, process for autoscalable program has remaining cores and RAM assigned.
Only one process for autoscalable program can run at same time.
Process minimal completion time is limited.
Processes can be rearranged by dragging them by their title.`)}
      </p>

      <div class=${topContainerClasses}>
        <sl-button class="start-process" variant="primary" size="medium" @click=${this.handleStartProcessDialogOpen}>
          ${msg('Start process')}
        </sl-button>

        <div class="ram">
          ${COMMON_TEXTS.parameterRow(msg('Available RAM'), `${formattedAvailableRam} / ${formattedMaxRam}`)}
        </div>

        <div class="cores">
          ${COMMON_TEXTS.parameterRow(msg('Available cores'), `${formattedAvailableCores} / ${formattedMaxCores}`)}
        </div>
      </div>

      <ca-processes-list></ca-processes-list>

      <ca-start-process-dialog
        ?open=${this._isStartProcessDialogOpen}
        @start-process-dialog-close=${this.handleStartProcessDialogClose}
      >
      </ca-start-process-dialog>
    `;
  }

  private handleStartProcessDialogOpen = () => {
    this._isStartProcessDialogOpen = true;
  };

  private handleStartProcessDialogClose = () => {
    this._isStartProcessDialogOpen = false;
  };
}
