import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ref, createRef } from 'lit/directives/ref.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import {
  BaseComponent,
  LevelFilterValue,
  StatusFilterValue,
  LEVEL_FILTER_VALUES,
  STATUS_FILTER_VALUES,
  compareOptions,
  ISelectOption,
} from '@shared/index';
import { STATUS_FILTER_TEXTS, COMMON_TEXTS, LEVEL_FILTER_TEXTS } from '@texts/common';
import { PROGRAM_TEXTS } from '@texts/index';
import { consume } from '@lit/context';
import { ProgramName } from '@state/mainframe-state';
import { OwnedProgramsFilterController } from './controller';
import styles from './styles';
import { programsFilterStateContext } from '../../contexts';
import { type IProgramsFilterState } from '../../interfaces';
import { ProgramsFilterStateChangedEvent } from './events';

@localized()
@customElement('ca-owned-programs-list-filter')
export class OwnedProgramsListFilter extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: OwnedProgramsFilterController;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  @consume({ context: programsFilterStateContext, subscribe: true })
  private _filterState?: IProgramsFilterState;

  private _programsInputRef = createRef<SlSelect>();
  private _tiersInputRef = createRef<SlSelect>();
  private _maxTierInputRef = createRef<SlSelect>();
  private _maxLevelInputRef = createRef<SlSelect>();
  private _autoupgradeInputRef = createRef<SlSelect>();

  constructor() {
    super();

    this._controller = new OwnedProgramsFilterController(this);
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
          ${ref(this._tiersInputRef)}
          name="tiers"
          hoist
          multiple
          clearable
          value=${this._filterState.tiers.join(' ')}
          @sl-change=${this.handleTiersChange}
        >
          <span class="input-label" slot="label"> ${msg('Tiers')} </span>

          ${this.renderTierOptions()}
        </sl-select>
      </div>

      <div class="filter-row">
        <sl-select
          ${ref(this._maxTierInputRef)}
          name="max-tier"
          hoist
          value=${this._filterState.maxTier}
          @sl-change=${this.handleMaxTierChange}
        >
          <span class="input-label" slot="label"> ${COMMON_TEXTS.maxTier()} </span>

          ${this.renderLevelFilterOptions()}
        </sl-select>

        <sl-select
          ${ref(this._maxLevelInputRef)}
          name="max-level"
          hoist
          value=${this._filterState.maxLevel}
          @sl-change=${this.handleMaxLevelChange}
        >
          <span class="input-label" slot="label"> ${COMMON_TEXTS.maxLevel()} </span>

          ${this.renderLevelFilterOptions()}
        </sl-select>

        <sl-select
          ${ref(this._autoupgradeInputRef)}
          name="autoupgrade"
          hoist
          value=${this._filterState.autoupgrade}
          @sl-change=${this.handleAutoupgradeChange}
        >
          <span class="input-label" slot="label"> ${COMMON_TEXTS.autoupgrade()} </span>

          ${this.renderAutoupgradeFilterOptions()}
        </sl-select>
      </div>
    </div>`;
  }

  private renderProgramNameOptions = () => {
    const programs = this._controller.listOwnedPrograms();
    const programOptions: ISelectOption[] = programs.map((program) => ({
      name: PROGRAM_TEXTS[program.name].title(),
      value: program.name,
    }));
    programOptions.sort(compareOptions);

    return programOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderTierOptions = () => {
    const tiers = new Set<number>();
    const programs = this._controller.listOwnedPrograms();

    programs.forEach((program) => {
      tiers.add(program.tier);
    });

    const tiersArray = Array.from(tiers.values());
    tiersArray.sort();

    const formatter = this._controller.formatter;

    return tiersArray.map((tier) => html`<sl-option value=${tier}>${formatter.formatTier(tier)}</sl-option>`);
  };

  private renderLevelFilterOptions = () => {
    return LEVEL_FILTER_VALUES.map(
      (value) => html`<sl-option value=${value}>${LEVEL_FILTER_TEXTS[value]()}</sl-option>`,
    );
  };

  private renderAutoupgradeFilterOptions = () => {
    return STATUS_FILTER_VALUES.map(
      (value) => html`<sl-option value=${value}>${STATUS_FILTER_TEXTS[value]()}</sl-option>`,
    );
  };

  private handleReset = () => {
    this.dispatchEvent(
      new ProgramsFilterStateChangedEvent({
        programs: [],
        tiers: [],
        maxTier: LevelFilterValue.all,
        maxLevel: LevelFilterValue.all,
        autoupgrade: StatusFilterValue.all,
      }),
    );
  };

  private handleProgramsChange = () => {
    if (!this._programsInputRef.value || !this._filterState) {
      return;
    }

    const programs = this._programsInputRef.value.value as ProgramName[];
    this.dispatchEvent(
      new ProgramsFilterStateChangedEvent({
        ...this._filterState,
        programs,
      }),
    );
  };

  private handleTiersChange = () => {
    if (!this._tiersInputRef.value || !this._filterState) {
      return;
    }

    const tiers = this._tiersInputRef.value.value as string[];
    const mappedTiers = tiers.map((tier) => parseInt(tier));

    this.dispatchEvent(
      new ProgramsFilterStateChangedEvent({
        ...this._filterState,
        tiers: mappedTiers,
      }),
    );
  };

  private handleMaxTierChange = () => {
    if (!this._maxTierInputRef.value || !this._filterState) {
      return;
    }

    const value = this._maxTierInputRef.value.value as LevelFilterValue;

    this.dispatchEvent(
      new ProgramsFilterStateChangedEvent({
        ...this._filterState,
        maxTier: value,
      }),
    );
  };

  private handleMaxLevelChange = () => {
    if (!this._maxLevelInputRef.value || !this._filterState) {
      return;
    }

    const value = this._maxLevelInputRef.value.value as LevelFilterValue;

    this.dispatchEvent(
      new ProgramsFilterStateChangedEvent({
        ...this._filterState,
        maxLevel: value,
      }),
    );
  };

  private handleAutoupgradeChange = () => {
    if (!this._autoupgradeInputRef.value || !this._filterState) {
      return;
    }

    const value = this._autoupgradeInputRef.value.value as StatusFilterValue;

    this.dispatchEvent(
      new ProgramsFilterStateChangedEvent({
        ...this._filterState,
        autoupgrade: value,
      }),
    );
  };
}
