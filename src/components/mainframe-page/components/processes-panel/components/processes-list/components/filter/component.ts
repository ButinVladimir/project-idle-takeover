import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ref, createRef } from 'lit/directives/ref.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { BaseComponent, StatusFilterValue, STATUS_FILTER_VALUES, ISelectOption, compareOptions } from '@shared/index';
import { STATUS_FILTER_TEXTS, COMMON_TEXTS } from '@texts/common';
import { PROGRAM_TEXTS } from '@texts/index';
import { consume } from '@lit/context';
import { ProgramName } from '@state/mainframe-state';
import { ProcessesListFilterController } from './controller';
import styles from './styles';
import { processesFilterStateContext } from '../../contexts';
import { type IProcessesFilterState } from '../../interfaces';
import { ProcessesFilterStateChangedEvent } from './events';
import { CORE_FILTER_TEXTS, CORE_FILTER_VALUES } from './constants';
import { CoreFilterValue } from '../../types';

@localized()
@customElement('ca-processes-list-filter')
export class ProcessesListFilter extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ProcessesListFilterController;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  @consume({ context: processesFilterStateContext, subscribe: true })
  private _filterState?: IProcessesFilterState;

  private _programsInputRef = createRef<SlSelect>();
  private _coresInputRef = createRef<SlSelect>();
  private _statusInputRef = createRef<SlSelect>();

  constructor() {
    super();

    this._controller = new ProcessesListFilterController(this);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    if (!this.filterEnabled || !this._filterState) {
      return nothing;
    }

    const contentClasses = classMap({
      filter: true,
      desktop: desktop,
      mobile: !desktop,
    });

    return html`<div class=${contentClasses}>
      <div><sl-button variant="default" @click=${this.handleReset}>${COMMON_TEXTS.resetFilter()}</sl-button></div>

      <div class="filter-row">
        <sl-select
          ${ref(this._programsInputRef)}
          name="programs"
          hoist
          multiple
          clearable
          value=${this._filterState.programs.join(' ')}
          @sl-change=${this.handleProgramsChange}
        >
          <span class="input-label" slot="label"> ${msg('Programs')} </span>

          ${this.renderProgramNameOptions()}
        </sl-select>

        <sl-select
          ${ref(this._coresInputRef)}
          name="cores"
          hoist
          multiple
          clearable
          value=${this._filterState.cores.join(' ')}
          @sl-change=${this.handleCoresChange}
        >
          <span class="input-label" slot="label"> ${msg('Cores')} </span>

          ${this.renderCoresOptions()}
        </sl-select>

        <sl-select
          ${ref(this._statusInputRef)}
          name="autoupgrade"
          hoist
          value=${this._filterState.status}
          @sl-change=${this.handleStatusChange}
        >
          <span class="input-label" slot="label"> ${msg('Status')} </span>

          ${this.renderStatusFilterOptions()}
        </sl-select>
      </div>
    </div>`;
  }

  private renderProgramNameOptions = () => {
    const processes = this._controller.listProcesses();
    const programOptions: ISelectOption[] = processes.map((process) => ({
      name: PROGRAM_TEXTS[process.program.name].title(),
      value: process.program.name,
    }));
    programOptions.sort(compareOptions);

    return programOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderCoresOptions = () => {
    return CORE_FILTER_VALUES.map(
      (coreFilterValue) =>
        html`<sl-option value=${coreFilterValue}>${CORE_FILTER_TEXTS[coreFilterValue]()}</sl-option>`,
    );
  };

  private renderStatusFilterOptions = () => {
    return STATUS_FILTER_VALUES.map(
      (value) => html`<sl-option value=${value}>${STATUS_FILTER_TEXTS[value]()}</sl-option>`,
    );
  };

  private handleReset = () => {
    this.dispatchEvent(
      new ProcessesFilterStateChangedEvent({
        programs: [],
        cores: [],
        status: StatusFilterValue.all,
      }),
    );
  };

  private handleProgramsChange = () => {
    if (!this._programsInputRef.value || !this._filterState) {
      return;
    }

    const programs = this._programsInputRef.value.value as ProgramName[];
    this.dispatchEvent(
      new ProcessesFilterStateChangedEvent({
        ...this._filterState,
        programs,
      }),
    );
  };

  private handleCoresChange = () => {
    if (!this._coresInputRef.value || !this._filterState) {
      return;
    }

    const cores = this._coresInputRef.value.value as CoreFilterValue[];
    this.dispatchEvent(
      new ProcessesFilterStateChangedEvent({
        ...this._filterState,
        cores,
      }),
    );
  };

  private handleStatusChange = () => {
    if (!this._statusInputRef.value || !this._filterState) {
      return;
    }

    const value = this._statusInputRef.value.value as StatusFilterValue;

    this.dispatchEvent(
      new ProcessesFilterStateChangedEvent({
        ...this._filterState,
        status: value,
      }),
    );
  };
}
