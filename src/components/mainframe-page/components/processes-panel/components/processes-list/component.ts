import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { IProcess, ProgramName } from '@state/mainframe-state';
import { BaseComponent, ProgramAlert, DELETE_VALUES, ENTITY_ACTIVE_VALUES } from '@shared/index';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { ProcessesListController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-processes-list')
export class ProcessesList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ProcessesListController;

  constructor() {
    super();

    this._controller = new ProcessesListController(this);
  }

  protected renderDesktop() {
    const processesActive = this.checkSomeProcessesActive();

    const toggleProcessesIcon = processesActive ? ENTITY_ACTIVE_VALUES.icon.active : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleProcessesLabel = processesActive ? msg('Disable all processes') : msg('Enable all processes');

    const deleteAllProcessLabel = msg('Delete all processes');

    const processes = this._controller.listProcesses();

    return html`
      <div class="header desktop">
        <div class="header-column">${msg('Program')}</div>
        <div class="header-column">${msg('Cores')}</div>
        <div class="header-column">${msg('Progress')}</div>
        <div class="buttons">
          <sl-tooltip>
            <span slot="content"> ${toggleProcessesLabel} </span>

            <sl-icon-button
              name=${toggleProcessesIcon}
              label=${toggleProcessesLabel}
              @click=${this.handleToggleAllProcesses}
            >
            </sl-icon-button>
          </sl-tooltip>

          <sl-tooltip>
            <span slot="content"> ${deleteAllProcessLabel} </span>

            <sl-icon-button
              id="delete-btn"
              name=${DELETE_VALUES.icon}
              label=${deleteAllProcessLabel}
              @click=${this.handleOpenDeleteAllProcessesDialog}
            >
            </sl-icon-button>
          </sl-tooltip>
        </div>
      </div>

      ${processes.length > 0
        ? html`
            <ca-sortable-list @sortable-element-moved=${this.handleMoveProcess}>
              ${repeat(processes, (process) => process.program.name, this.renderProcess)}
            </ca-sortable-list>
          `
        : this.renderEmptyListNotification()}
    `;
  }

  protected renderMobile() {
    const processesActive = this.checkSomeProcessesActive();

    const toggleProcessesIcon = processesActive ? ENTITY_ACTIVE_VALUES.icon.active : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleProcessesLabel = processesActive ? msg('Disable all processes') : msg('Enable all processes');
    const toggleProcessesVariant = processesActive
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;

    const deleteAllProcessLabel = msg('Delete all processes');

    const processes = this._controller.listProcesses();

    return html`
      <div class="header mobile">
        <div class="buttons">
          <sl-button variant=${toggleProcessesVariant} size="medium" @click=${this.handleToggleAllProcesses}>
            <sl-icon slot="prefix" name=${toggleProcessesIcon}></sl-icon>

            ${toggleProcessesLabel}
          </sl-button>

          <sl-button
            variant=${DELETE_VALUES.buttonVariant}
            size="medium"
            @click=${this.handleOpenDeleteAllProcessesDialog}
          >
            <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>
            ${deleteAllProcessLabel}
          </sl-button>
        </div>
      </div>

      ${processes.length > 0
        ? html`
            <ca-sortable-list @sortable-element-moved=${this.handleMoveProcess}>
              ${repeat(processes, (process) => process.program.name, this.renderProcess)}
            </ca-sortable-list>
          `
        : this.renderEmptyListNotification()}
    `;
  }

  private renderEmptyListNotification = () => {
    return html`
      <div class="notification">
        <td colspan="4">${msg("You don't have any processes")}</td>
      </div>
    `;
  };

  private renderProcess = (process: IProcess) => {
    return html`
      <ca-processes-list-item program-name=${process.program.name} data-drag-id=${process.program.name}>
      </ca-processes-list-item>
    `;
  };

  private checkSomeProcessesActive(): boolean {
    return this._controller.listProcesses().some((process) => process.enabled);
  }

  private handleToggleAllProcesses = () => {
    const processesActive = this.checkSomeProcessesActive();

    this._controller.toggleAllProcesses(!processesActive);
  };

  private handleOpenDeleteAllProcessesDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        ProgramAlert.deleteAllProcesses,
        msg('Are you sure want to delete all processes? Their progress will be lost.'),
        this.handleDeleteAllProcesses,
      ),
    );
  };

  private handleDeleteAllProcesses = () => {
    this._controller.deleteAllProcesses();
  };

  private handleMoveProcess = (event: SortableElementMovedEvent) => {
    this._controller.moveProcess(event.keyName as ProgramName, event.position);
  };
}
