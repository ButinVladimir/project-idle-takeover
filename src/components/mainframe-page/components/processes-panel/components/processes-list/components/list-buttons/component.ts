import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, FILTER_VALUES, ProgramAlert, ENTITY_ACTIVE_VALUES, DELETE_VALUES } from '@shared/index';
import { COMMON_TEXTS } from '@texts/common';
import { IProcess } from '@state/mainframe-state';
import { ProcessesListButtonsController } from './controller';
import styles from './styles';
import { ToggleProcessesFilterEvent } from './events';
import { consume } from '@lit/context';
import { processesListContext } from '../../contexts';

@localized()
@customElement('ca-processes-list-buttons')
export class ProcessesListButtons extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  private _controller: ProcessesListButtonsController;

  @consume({ context: processesListContext, subscribe: true })
  private _processesList?: IProcess[];

  constructor() {
    super();

    this._controller = new ProcessesListButtonsController(this);
  }

  protected renderDesktop() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();

    const processesActive = this.checkSomeProcessesActive();

    const toggleProcessesIcon = processesActive ? ENTITY_ACTIVE_VALUES.icon.active : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleProcessesLabel = processesActive
      ? msg('Disable displayed processes')
      : msg('Enable displayed processes');

    const deleteProcessesLabel = msg('Delete displayed processes');

    return html`
      <div class="buttons desktop">
        <sl-tooltip>
          <span slot="content"> ${filterLabel} </span>

          <sl-icon-button name=${filterIcon} label=${filterLabel} @click=${this.handleToggleFilter}> </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip>
          <span slot="content"> ${toggleProcessesLabel} </span>

          <sl-icon-button
            name=${toggleProcessesIcon}
            label=${toggleProcessesLabel}
            @click=${this.handleToggleProcesses}
          >
          </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip>
          <span slot="content"> ${deleteProcessesLabel} </span>

          <sl-icon-button
            id="delete-btn"
            name=${DELETE_VALUES.icon}
            label=${deleteProcessesLabel}
            @click=${this.handleOpenDeleteDisplayedProcessesDialog}
          >
          </sl-icon-button>
        </sl-tooltip>
      </div>
    `;
  }

  protected renderMobile() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();
    const filterVariant = this.filterEnabled
      ? FILTER_VALUES.buttonVariant.enabled
      : FILTER_VALUES.buttonVariant.disabled;

    const processesActive = this.checkSomeProcessesActive();

    const toggleProcessesIcon = processesActive ? ENTITY_ACTIVE_VALUES.icon.active : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleProcessesLabel = processesActive
      ? msg('Disable displayed processes')
      : msg('Enable displayed processes');
    const toggleProcessesVariant = processesActive
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;

    const deleteProcessesLabel = msg('Delete displayed processes');

    return html`
      <div class="buttons mobile">
        <sl-button variant=${filterVariant} size="medium" @click=${this.handleToggleFilter}>
          <sl-icon slot="prefix" name=${filterIcon}> </sl-icon>

          ${filterLabel}
        </sl-button>

        <sl-button variant=${toggleProcessesVariant} size="medium" @click=${this.handleToggleProcesses}>
          <sl-icon slot="prefix" name=${toggleProcessesIcon}></sl-icon>

          ${toggleProcessesLabel}
        </sl-button>

        <sl-button
          variant=${DELETE_VALUES.buttonVariant}
          size="medium"
          @click=${this.handleOpenDeleteDisplayedProcessesDialog}
        >
          <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>
          ${deleteProcessesLabel}
        </sl-button>
      </div>
    `;
  }

  private checkSomeProcessesActive(): boolean {
    if (!this._processesList || this._processesList.length === 0) {
      return false;
    }

    return this._processesList.some((process) => process.enabled);
  }

  private handleToggleProcesses = () => {
    if (!this._processesList) {
      return;
    }

    const processesActive = this.checkSomeProcessesActive();

    this._processesList.forEach((process) => {
      process.toggleEnabled(!processesActive);
    });
  };

  private handleOpenDeleteDisplayedProcessesDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        ProgramAlert.deleteDisplayedProcesses,
        msg('Are you sure want to delete displayed processes? Their progress will be lost.'),
        this.handleDeleteDisplayedProcesses,
      ),
    );
  };

  private handleDeleteDisplayedProcesses = () => {
    this._controller.deleteProcesses(this._processesList!.map((process) => process.program.name));
  };

  private handleToggleFilter = () => {
    this.dispatchEvent(new ToggleProcessesFilterEvent(!this.filterEnabled));
  };
}
