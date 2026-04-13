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
} from '@shared/index';
import { STATE_FILTER_TEXTS, COMMON_TEXTS } from '@texts/common';
import { SIDEJOB_TEXTS } from '@texts/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { SidejobsListFilterController } from './controller';
import styles from './styles';
import { sidejobsFilterStateContext } from '../../contexts';
import { type ISidejobsFilterState } from '../../interfaces';
import { SidejobsFilterStateChangedEvent } from './events';
import { SIDEJOB_STATUS_FILTER_TEXTS } from './constants';

@localized()
@customElement('ca-sidejobs-list-filter')
export class SidejobsListFilter extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: SidejobsListFilterController;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  @consume({ context: sidejobsFilterStateContext, subscribe: true })
  private _filterState?: ISidejobsFilterState;

  private _cloneIdsInputRef = createRef<SlSelect>();
  private _districtIndexesInputRef = createRef<SlSelect>();
  private _sidejobNamesInputRef = createRef<SlSelect>();
  private _statusInputRef = createRef<SlSelect>();
  private _enabledInputRef = createRef<SlSelect>();

  constructor() {
    super();

    this._controller = new SidejobsListFilterController(this);
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
          ${ref(this._sidejobNamesInputRef)}
          name="sidejob-names"
          hoist
          multiple
          clearable
          value=${this._filterState.sidejobNames.join(' ')}
          @sl-change=${this.handleSidejobNamesChange}
        >
          <span class="input-label" slot="label"> ${msg('Sidejobs')} </span>

          ${this.renderSidejobNamesOptions()}
        </sl-select>

        <sl-select
          ${ref(this._districtIndexesInputRef)}
          name="district-indexes"
          hoist
          multiple
          clearable
          value=${this._filterState.districtIndexes.join(' ')}
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
          value=${this._filterState.cloneIds.join(' ')}
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
    const sidejobs = this._controller.listSidejobs();

    const clones = new Set<IClone>();

    sidejobs.forEach((sidejobActivity) => {
      clones.add(sidejobActivity.sidejob.assignedClone);
    });

    const clonesArray = Array.from(clones.values());
    const options: ISelectOption[] = clonesArray.map((clone) => ({
      name: clone.name,
      value: clone.id,
    }));
    options.sort(compareOptions);

    return options.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderDistrictIndexesOptions = () => {
    const sidejobs = this._controller.listSidejobs();

    const districts = new Set<IDistrictState>();

    sidejobs.forEach((sidejobActivity) => {
      districts.add(sidejobActivity.sidejob.district);
    });

    const districtsArray = Array.from(districts.values());
    const options: ISelectOption[] = districtsArray.map((district) => ({
      name: district.name,
      value: district.index.toString(),
    }));
    options.sort(compareOptions);

    return options.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderSidejobNamesOptions = () => {
    const sidejobs = this._controller.listSidejobs();

    const sidejobNames = new Set<string>();

    sidejobs.forEach((sidejobActivity) => {
      sidejobNames.add(sidejobActivity.sidejob.sidejobName);
    });

    const sidejobNamesArray = Array.from(sidejobNames.values());
    const options: ISelectOption[] = sidejobNamesArray.map((sidejobName) => ({
      name: SIDEJOB_TEXTS[sidejobName].title(),
      value: sidejobName,
    }));
    options.sort(compareOptions);

    return options.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderStatusFilterOptions = () => {
    return ACTIVITY_STATUS_FILTER_VALUES.map(
      (value) => html`<sl-option value=${value}>${SIDEJOB_STATUS_FILTER_TEXTS[value]()}</sl-option>`,
    );
  };

  private renderEnabledFilterOptions = () => {
    return STATE_FILTER_VALUES.map(
      (value) => html`<sl-option value=${value}>${STATE_FILTER_TEXTS[value]()}</sl-option>`,
    );
  };

  private handleReset = () => {
    this.dispatchEvent(
      new SidejobsFilterStateChangedEvent({
        cloneIds: [],
        districtIndexes: [],
        sidejobNames: [],
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
      new SidejobsFilterStateChangedEvent({
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
      new SidejobsFilterStateChangedEvent({
        ...this._filterState,
        districtIndexes,
      }),
    );
  };

  private handleSidejobNamesChange = () => {
    if (!this._sidejobNamesInputRef.value || !this._filterState) {
      return;
    }

    const sidejobNames = this._sidejobNamesInputRef.value.value as string[];
    this.dispatchEvent(
      new SidejobsFilterStateChangedEvent({
        ...this._filterState,
        sidejobNames,
      }),
    );
  };

  private handleStatusChange = () => {
    if (!this._statusInputRef.value || !this._filterState) {
      return;
    }

    const status = this._statusInputRef.value.value as ActivityStatusFilterValue;
    this.dispatchEvent(
      new SidejobsFilterStateChangedEvent({
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
      new SidejobsFilterStateChangedEvent({
        ...this._filterState,
        enabled,
      }),
    );
  };
}
