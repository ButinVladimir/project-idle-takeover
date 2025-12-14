import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { BaseComponent, Feature } from '@shared/index';
import { OverviewUnlockedContentPanelController } from './controller';
import styles from './styles';
import { ItemTypeFilter } from './types';
import { ITEM_TYPE_FILTER_TITLES, ITEM_TYPE_FILTER_VALUES } from './constants';

@localized()
@customElement('ca-overview-unlocked-content-panel')
export class OverviewUnlockedContentPanel extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _itemTypeFilterInputRef = createRef<SlSelect>();

  @state()
  private _itemTypeFilter: ItemTypeFilter = ItemTypeFilter.all;

  private _controller: OverviewUnlockedContentPanelController;

  constructor() {
    super();

    this._controller = new OverviewUnlockedContentPanelController(this);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    const itemTypeFilterContainerClasses = classMap({
      'item-type-filter-container': true,
      desktop: desktop,
      mobile: !desktop,
    });

    return html`
      <p class="hint">
        ${msg(`Loaned items are received after joining faction.
Number next to item name is it's maximum tier available.`)}
      </p>

      <div class=${itemTypeFilterContainerClasses}>
        <sl-select
          ${ref(this._itemTypeFilterInputRef)}
          name="type-filter"
          value=${this._itemTypeFilter}
          hoist
          @sl-change=${this.handleItemTypeFilterChange}
        >
          ${ITEM_TYPE_FILTER_VALUES.map(
            (type) => html`<sl-option value=${type}> ${ITEM_TYPE_FILTER_TITLES[type]()}</sl-option>`,
          )}
        </sl-select>
      </div>

      <div class="categories">
        <ca-overview-unlocked-features></ca-overview-unlocked-features>

        ${this.renderSidejobs()} ${this.renderContracts()} ${this.renderPrograms()} ${this.renderClones()}
      </div>
    `;
  }

  private handleItemTypeFilterChange = () => {
    if (!this._itemTypeFilterInputRef.value) {
      return;
    }

    const itemTypeFilterValue = this._itemTypeFilterInputRef.value.value as ItemTypeFilter;
    this._itemTypeFilter = itemTypeFilterValue;
  };

  private renderSidejobs = () => {
    if (!this._controller.isFeatureUnlocked(Feature.companyManagement)) {
      return nothing;
    }

    return html`<ca-overview-unlocked-sidejobs></ca-overview-unlocked-sidejobs>`;
  };

  private renderContracts = () => {
    if (!this._controller.isFeatureUnlocked(Feature.contracts)) {
      return nothing;
    }

    return html`<ca-overview-unlocked-contracts></ca-overview-unlocked-contracts>`;
  };

  private renderPrograms = () => {
    if (!this._controller.isFeatureUnlocked(Feature.mainframePrograms)) {
      return nothing;
    }

    return html`
      <ca-overview-unlocked-programs item-type-filer=${this._itemTypeFilter}></ca-overview-unlocked-programs>
    `;
  };

  private renderClones = () => {
    if (!this._controller.isFeatureUnlocked(Feature.companyManagement)) {
      return nothing;
    }

    return html`
      <ca-overview-unlocked-clone-templates
        item-type-filer=${this._itemTypeFilter}
      ></ca-overview-unlocked-clone-templates>
    `;
  };
}
