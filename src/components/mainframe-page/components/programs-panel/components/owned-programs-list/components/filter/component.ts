import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ref, createRef } from 'lit/directives/ref.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { BaseComponent, AUTOUPGRADE_VALUES, UPGRADE_MAX_VALUES, FILTER_VALUES } from '@shared/index';
import { COMMON_TEXTS } from '@texts/common';
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
          multiple
          clearable
          value=${this._filterState.tiers.join(' ')}
          @sl-change=${this.handleTiersChange}
        >
          <span class="input-label" slot="label"> ${msg('Tiers')} </span>

          ${this.renderTierOptions()}
        </sl-select>
      </div>
    </div>`;
  }

  private renderProgramNameOptions = () => {
    const programs = this._controller.listOwnedPrograms();

    return programs.map(
      (program) => html`<sl-option value=${program.name}>${PROGRAM_TEXTS[program.name].title()}</sl-option>`,
    );
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

  private handleReset = () => {
    this.dispatchEvent(
      new ProgramsFilterStateChangedEvent({
        programs: [],
        tiers: [],
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
}
