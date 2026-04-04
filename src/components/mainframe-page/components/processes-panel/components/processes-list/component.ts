import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { provide } from '@lit/context';
import { IProcess, ProgramName } from '@state/mainframe-state';
import { BaseComponent, StatusFilterValue, filterByEnabled } from '@shared/index';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { ProcessesListController } from './controller';
import styles from './styles';
import { processesFilterStateContext, processesListContext } from './contexts';
import { type IProcessesFilterState } from './interfaces';
import { CoreFilterValue } from './types';
import { ToggleProcessesFilterEvent } from './components/list-buttons/events';
import { ProcessesFilterStateChangedEvent } from './components/filter/events';

@localized()
@customElement('ca-processes-list')
export class ProcessesList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ProcessesListController;

  @state()
  private _filterEnabled = false;

  @state()
  @provide({ context: processesFilterStateContext })
  private _processesFilterState: IProcessesFilterState = {
    programs: [],
    cores: [],
    status: StatusFilterValue.all,
  };

  @provide({ context: processesListContext })
  private _processesList: IProcess[] = [];

  constructor() {
    super();

    this._controller = new ProcessesListController(this);
  }

  protected renderDesktop() {
    return html`
      <div class="items-list">
        <ca-processes-list-filter
          ?filter-enabled=${this._filterEnabled}
          @processes-filter-state-changed=${this.handleChangeFilterState}
        ></ca-processes-list-filter>

        <div class="header desktop">
          <div class="header-column">${msg('Program')}</div>
          <div class="header-column">${msg('Cores')}</div>
          <div class="header-column">${msg('Progress')}</div>
          <ca-processes-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-processes-filter=${this.handleToggleFilter}
          >
          </ca-processes-list-buttons>
        </div>

        ${this._processesList.length > 0
          ? html`
              <ca-sortable-list
                class="list"
                ?drag-enabled=${!this._filterEnabled}
                @sortable-element-moved=${this.handleMoveProcess}
              >
                ${repeat(this._processesList, (process) => process.program.name, this.renderProcess)}
              </ca-sortable-list>
            `
          : this.renderEmptyListNotification()}
      </div>
    `;
  }

  protected renderMobile() {
    return html`
      <div class="items-list">
        <ca-processes-list-filter
          ?filter-enabled=${this._filterEnabled}
          @processes-filter-state-changed=${this.handleChangeFilterState}
        ></ca-processes-list-filter>

        <div class="header mobile">
          <ca-processes-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-processes-filter=${this.handleToggleFilter}
          >
          </ca-processes-list-buttons>
        </div>

        ${this._processesList.length > 0
          ? html`
              <ca-sortable-list
                class="list"
                ?drag-enabled=${!this._filterEnabled}
                @sortable-element-moved=${this.handleMoveProcess}
              >
                ${repeat(this._processesList, (process) => process.program.name, this.renderProcess)}
              </ca-sortable-list>
            `
          : this.renderEmptyListNotification()}
      </div>
    `;
  }

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg('Processes are not found')}</div> `;
  };

  private renderProcess = (process: IProcess) => {
    return html`
      <ca-processes-list-item
        class="list-item"
        ?drag-enabled=${!this._filterEnabled}
        program-name=${process.program.name}
        data-drag-id=${process.program.name}
      >
      </ca-processes-list-item>
    `;
  };

  private handleToggleFilter = (event: ToggleProcessesFilterEvent) => {
    this._filterEnabled = event.filterEnabled;
  };

  private handleChangeFilterState = (event: ProcessesFilterStateChangedEvent) => {
    this._processesFilterState = event.state;
  };

  protected updateContext(): void {
    let processes = this._controller.listProcesses();

    if (this._filterEnabled) {
      processes = processes.filter(this.filterProcess);
    }

    this._processesList = processes;
  }

  private filterProcess = (process: IProcess): boolean => {
    if (!this._filterEnabled) {
      return true;
    }

    if (
      this._processesFilterState.programs.length > 0 &&
      !this._processesFilterState.programs.includes(process.program.name)
    ) {
      return false;
    }

    if (!this.filterByCores(process)) {
      return false;
    }

    if (!filterByEnabled(process.enabled, this._processesFilterState.status)) {
      return false;
    }

    return true;
  };

  private filterByCores(process: IProcess): boolean {
    if (this._processesFilterState.cores.length === 0) {
      return true;
    }

    let state: CoreFilterValue = CoreFilterValue.notAssigned;

    if (process.usedCores > 0 && process.usedCores < process.maxCores) {
      state = CoreFilterValue.partiallyAssigned;
    }

    if (process.usedCores >= process.maxCores) {
      state = CoreFilterValue.fullyAssigned;
    }

    return this._processesFilterState.cores.includes(state);
  }

  private handleMoveProcess = (event: SortableElementMovedEvent) => {
    this._controller.moveProcess(event.keyName as ProgramName, event.position);
  };
}
