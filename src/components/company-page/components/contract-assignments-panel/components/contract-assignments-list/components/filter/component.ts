import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import {
  BaseComponent,
  StateFilterValue,
  STATE_FILTER_VALUES,
  ISelectOption,
  compareOptions,
  ACTIVITY_STATUS_FILTER_VALUES,
  ActivityStatusFilterValue,
  MULTIPLE_SELECT_SEPARATOR,
} from '@shared/index';
import { STATE_FILTER_TEXTS, COMMON_TEXTS } from '@texts/common';
import { CONTRACT_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { ContractAssigmentsListFilterController } from './controller';
import styles from './styles';
import { contractsFilterStateContext } from '../../contexts';
import { type IContractsFilterState } from '../../interfaces';
import { ContractsFilterStateChangedEvent } from './events';
import { CONTRACT_STATUS_FILTER_TEXTS } from './constants';

@localized()
@customElement('ca-contact-assigments-list-filter')
export class ContractAssignmentsListFilter extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ContractAssigmentsListFilterController;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  @consume({ context: contractsFilterStateContext, subscribe: true })
  private _filterState?: IContractsFilterState;

  private _cloneIdsInputRef = createRef<SlSelect>();
  private _districtIndexesInputRef = createRef<SlSelect>();
  private _contractNamesInputRef = createRef<SlSelect>();
  private _statusInputRef = createRef<SlSelect>();
  private _enabledInputRef = createRef<SlSelect>();

  constructor() {
    super();

    this._controller = new ContractAssigmentsListFilterController(this);
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
          ${ref(this._contractNamesInputRef)}
          name="contract-names"
          hoist
          multiple
          clearable
          value=${this._filterState.contractNames.join(MULTIPLE_SELECT_SEPARATOR)}
          @sl-change=${this.handleContractNamesChange}
        >
          <span class="input-label" slot="label"> ${msg('Contracts')} </span>

          ${this.renderContractNamesOptions()}
        </sl-select>

        <sl-select
          ${ref(this._districtIndexesInputRef)}
          name="district-indexes"
          hoist
          multiple
          clearable
          value=${this._filterState.districtIndexes.join(MULTIPLE_SELECT_SEPARATOR)}
          @sl-change=${this.handleDistrictIndexesChange}
        >
          <span class="input-label" slot="label"> ${msg('Districts')} </span>

          ${this.renderDistrictIndexesOptions()}
        </sl-select>

        <sl-select
          ${ref(this._cloneIdsInputRef)}
          name="clone-ids"
          hoist
          multiple
          clearable
          value=${this._filterState.cloneIds.join(MULTIPLE_SELECT_SEPARATOR)}
          @sl-change=${this.handleCloneIdsChange}
        >
          <span class="input-label" slot="label"> ${msg('Clones')} </span>

          ${this.renderCloneIdsOptions()}
        </sl-select>
      </div>

      <div class="filter-row">
        <sl-select
          ${ref(this._statusInputRef)}
          name="status"
          hoist
          value=${this._filterState.state}
          @sl-change=${this.handleStatusChange}
        >
          <span class="input-label" slot="label"> ${msg('Status')} </span>

          ${this.renderStatusFilterOptions()}
        </sl-select>

        <sl-select
          ${ref(this._enabledInputRef)}
          name="enabled"
          hoist
          value=${this._filterState.enabled}
          @sl-change=${this.handleEnabledChange}
        >
          <span class="input-label" slot="label"> ${msg('State')} </span>

          ${this.renderEnabledFilterOptions()}
        </sl-select>
      </div>
    </div>`;
  }

  private renderCloneIdsOptions = () => {
    const clones = this._controller.listOwnedClones();

    const options: ISelectOption[] = clones.map((clone) => ({
      name: clone.name,
      value: clone.id,
    }));
    options.sort(compareOptions);

    return options.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderDistrictIndexesOptions = () => {
    const districts = this._controller.listAvailableDistricts();

    const options: ISelectOption[] = districts.map((district) => ({
      name: DISTRICT_NAMES[district.name](),
      value: district.index.toString(),
    }));
    options.sort(compareOptions);

    return options.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderContractNamesOptions = () => {
    const contractNames = this._controller.listAvailableContracts();

    const options: ISelectOption[] = contractNames.map((contractName) => ({
      name: CONTRACT_TEXTS[contractName].title(),
      value: contractName,
    }));
    options.sort(compareOptions);

    return options.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderStatusFilterOptions = () => {
    return ACTIVITY_STATUS_FILTER_VALUES.map(
      (value) => html`<sl-option value=${value}>${CONTRACT_STATUS_FILTER_TEXTS[value]()}</sl-option>`,
    );
  };

  private renderEnabledFilterOptions = () => {
    return STATE_FILTER_VALUES.map(
      (value) => html`<sl-option value=${value}>${STATE_FILTER_TEXTS[value]()}</sl-option>`,
    );
  };

  private handleReset = () => {
    this.dispatchEvent(
      new ContractsFilterStateChangedEvent({
        cloneIds: [],
        districtIndexes: [],
        contractNames: [],
        state: ActivityStatusFilterValue.all,
        enabled: StateFilterValue.all,
      }),
    );
  };

  private handleCloneIdsChange = () => {
    if (!this._cloneIdsInputRef.value || !this._filterState) {
      return;
    }

    const cloneIds = this._cloneIdsInputRef.value.value as string[];
    this.dispatchEvent(
      new ContractsFilterStateChangedEvent({
        ...this._filterState,
        cloneIds,
      }),
    );
  };

  private handleDistrictIndexesChange = () => {
    if (!this._districtIndexesInputRef.value || !this._filterState) {
      return;
    }

    const districtIndexesString = this._districtIndexesInputRef.value.value as string[];
    const districtIndexes = districtIndexesString.map((str) => parseInt(str));

    this.dispatchEvent(
      new ContractsFilterStateChangedEvent({
        ...this._filterState,
        districtIndexes,
      }),
    );
  };

  private handleContractNamesChange = () => {
    if (!this._contractNamesInputRef.value || !this._filterState) {
      return;
    }

    const contractNames = this._contractNamesInputRef.value.value as string[];
    this.dispatchEvent(
      new ContractsFilterStateChangedEvent({
        ...this._filterState,
        contractNames,
      }),
    );
  };

  private handleStatusChange = () => {
    if (!this._statusInputRef.value || !this._filterState) {
      return;
    }

    const status = this._statusInputRef.value.value as ActivityStatusFilterValue;
    this.dispatchEvent(
      new ContractsFilterStateChangedEvent({
        ...this._filterState,
        state: status,
      }),
    );
  };

  private handleEnabledChange = () => {
    if (!this._enabledInputRef.value || !this._filterState) {
      return;
    }

    const enabled = this._enabledInputRef.value.value as StateFilterValue;
    this.dispatchEvent(
      new ContractsFilterStateChangedEvent({
        ...this._filterState,
        enabled,
      }),
    );
  };
}
