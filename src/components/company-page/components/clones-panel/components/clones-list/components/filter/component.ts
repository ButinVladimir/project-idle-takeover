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
import { CLONE_TEMPLATE_TEXTS } from '@texts/index';
import { consume } from '@lit/context';
import { ClonesFilterController } from './controller';
import styles from './styles';
import { clonesFilterStateContext } from '../../contexts';
import { type IClonesFilterState } from '../../interfaces';
import { ClonesFilterStateChangedEvent } from './events';

@localized()
@customElement('ca-clones-list-filter')
export class ClonesListFilter extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ClonesFilterController;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  @consume({ context: clonesFilterStateContext, subscribe: true })
  private _filterState?: IClonesFilterState;

  private _clonesInputRef = createRef<SlSelect>();
  private _cloneTemplatesInputRef = createRef<SlSelect>();
  private _tiersInputRef = createRef<SlSelect>();
  private _maxTierInputRef = createRef<SlSelect>();
  private _maxLevelInputRef = createRef<SlSelect>();
  private _autoupgradeInputRef = createRef<SlSelect>();

  constructor() {
    super();

    this._controller = new ClonesFilterController(this);
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
          ${ref(this._clonesInputRef)}
          name="clones"
          hoist
          multiple
          clearable
          value=${this._filterState.clones.join(' ')}
          @sl-change=${this.handleClonesChange}
        >
          <span class="input-label" slot="label"> ${msg('Clones')} </span>

          ${this.renderCloneOptions()}
        </sl-select>

        <sl-select
          ${ref(this._cloneTemplatesInputRef)}
          name="cloneTemplates"
          hoist
          multiple
          clearable
          value=${this._filterState.cloneTemplates.join(' ')}
          @sl-change=${this.handleCloneTemplatesChange}
        >
          <span class="input-label" slot="label"> ${msg('Clone templates')} </span>

          ${this.renderCloneTemplateOptions()}
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

  private renderCloneOptions = () => {
    const clones = this._controller.listClones();

    const cloneOptions: ISelectOption[] = [];
    clones.map((clone) => {
      cloneOptions.push({
        name: clone.name,
        value: clone.name,
      });
    });
    cloneOptions.sort(compareOptions);

    return cloneOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderCloneTemplateOptions = () => {
    const cloneTemplates = new Set<string>();
    const clones = this._controller.listClones();

    clones.forEach((clone) => {
      cloneTemplates.add(clone.templateName);
    });

    const cloneTemplateOptions: ISelectOption[] = [];
    cloneTemplates.forEach((cloneTemplate) => {
      cloneTemplateOptions.push({
        name: CLONE_TEMPLATE_TEXTS[cloneTemplate].title(),
        value: cloneTemplate,
      });
    });
    cloneTemplateOptions.sort(compareOptions);

    return cloneTemplateOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderTierOptions = () => {
    const tiers = new Set<number>();
    const clones = this._controller.listClones();

    clones.forEach((clone) => {
      tiers.add(clone.tier);
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
      new ClonesFilterStateChangedEvent({
        clones: [],
        cloneTemplates: [],
        tiers: [],
        maxTier: LevelFilterValue.all,
        maxLevel: LevelFilterValue.all,
        autoupgrade: StatusFilterValue.all,
      }),
    );
  };

  private handleClonesChange = () => {
    if (!this._clonesInputRef.value || !this._filterState) {
      return;
    }

    const clones = this._clonesInputRef.value.value as string[];
    this.dispatchEvent(
      new ClonesFilterStateChangedEvent({
        ...this._filterState,
        clones,
      }),
    );
  };

  private handleCloneTemplatesChange = () => {
    if (!this._cloneTemplatesInputRef.value || !this._filterState) {
      return;
    }

    const cloneTemplates = this._cloneTemplatesInputRef.value.value as string[];
    this.dispatchEvent(
      new ClonesFilterStateChangedEvent({
        ...this._filterState,
        cloneTemplates,
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
      new ClonesFilterStateChangedEvent({
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
      new ClonesFilterStateChangedEvent({
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
      new ClonesFilterStateChangedEvent({
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
      new ClonesFilterStateChangedEvent({
        ...this._filterState,
        autoupgrade: value,
      }),
    );
  };
}
