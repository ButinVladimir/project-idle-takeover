import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';
import { provide } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { DISTRICT_NAMES } from '@texts/index';
import { CITY_DISTRICT_PAGE_TAB_LIST, CITY_DISTRICT_PAGE_TAB_TITLES } from './constants';
import { CityDistrictPageTabs } from './types';
import { CityDistrictPageController } from './controller';
import { ReturnCityMapPageEvent } from './events';
import { districtIndexContext } from './contexts';
import cityDistrictPageStyles from './styles';

@localized()
@customElement('ca-city-district-page')
export class CityDistrictPage extends BaseComponent {
  static styles = cityDistrictPageStyles;

  @provide({ context: districtIndexContext })
  @property({
    attribute: 'district-index',
    type: Number,
  })
  districtIndex!: number;

  private _controller: CityDistrictPageController;

  constructor() {
    super();

    this._controller = new CityDistrictPageController(this);
  }

  protected renderDesktop() {
    const districtState = this._controller.getDistrictState(this.districtIndex);

    const goBackLabel = msg('Go back to the map');

    return html`
      <div class="title">
        <sl-tooltip>
          <span slot="content">${goBackLabel}</span>

          <sl-icon-button
            class="go-back-btn"
            label=${goBackLabel}
            name="chevron-compact-left"
            @click=${this.handleGoBack}
          ></sl-icon-button>
        </sl-tooltip>

        <h3 class="title">${DISTRICT_NAMES[districtState.name]()}</h3>
      </div>

      <sl-tab-group> ${this.renderTabs()} ${this.renderTabPanels()} </sl-tab-group>
    `;
  }

  private renderTabs = () => {
    return CITY_DISTRICT_PAGE_TAB_LIST.map(this.renderTab);
  };

  private renderTab = (tab: CityDistrictPageTabs) => {
    if (!this.isTabUnlocked(tab)) {
      return nothing;
    }

    return html`<sl-tab slot="nav" panel=${tab}>${CITY_DISTRICT_PAGE_TAB_TITLES[tab]()}</sl-tab>`;
  };

  private renderTabPanels = () => {
    return CITY_DISTRICT_PAGE_TAB_LIST.map(this.renderTabPanel);
  };

  private renderTabPanel = (tab: CityDistrictPageTabs) => {
    if (!this.isTabUnlocked(tab)) {
      return nothing;
    }

    return html`<sl-tab-panel name=${tab}>${this.renderTabPanelContent(tab)}</sl-tab-panel>`;
  };

  private renderTabPanelContent = (tab: CityDistrictPageTabs) => {
    switch (tab) {
      case CityDistrictPageTabs.overview:
        return html`<ca-city-district-overview-panel></ca-city-district-overview-panel>`;

      case CityDistrictPageTabs.sidejobs:
        return html`<ca-city-district-sidejobs-panel></ca-city-district-sidejobs-panel>`;

      case CityDistrictPageTabs.contracts:
        return html`<ca-city-district-contract-panel></ca-city-district-contract-panel>`;
    }
  };

  private handleGoBack = () => {
    this.dispatchEvent(new ReturnCityMapPageEvent());
  };

  private isTabUnlocked = (tab: CityDistrictPageTabs) => {
    switch (tab) {
      case CityDistrictPageTabs.contracts:
        return this._controller.isContractsTabUnlocked();
      default:
        return true;
    }
  };
}
