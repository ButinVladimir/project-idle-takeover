import { html, nothing } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import { CompanyPageController } from './controller';
import { CompanyPageTabs } from './types';
import { COMPANY_PAGE_TABS_LIST, COMPANY_PAGE_TAB_TITLES } from './constants';
import styles from './styles';

@localized()
@customElement('ca-company-page')
export class CompanyPage extends BaseComponent {
  static styles = styles;

  private _controller: CompanyPageController;

  constructor() {
    super();

    this._controller = new CompanyPageController(this);
  }

  renderDesktop() {
    return html`
      <h3 class="title">${msg('Company')}</h3>

      <sl-tab-group>
        ${COMPANY_PAGE_TABS_LIST.map(this.renderTab)} ${COMPANY_PAGE_TABS_LIST.map(this.renderTabPanel)}
      </sl-tab-group>
    `;
  }

  private isTabUnlocked = (tab: CompanyPageTabs): boolean => {
    switch (tab) {
      case CompanyPageTabs.contractAssignments:
      case CompanyPageTabs.primaryActivityQueue:
        return this._controller.isPrimaryActivityUnlocked();
      default:
        return true;
    }
  };

  private renderTab = (tab: CompanyPageTabs) => {
    if (!this.isTabUnlocked(tab)) {
      return nothing;
    }

    return html` <sl-tab slot="nav" panel=${tab}> ${COMPANY_PAGE_TAB_TITLES[tab]()} </sl-tab> `;
  };

  private renderTabPanel = (tab: CompanyPageTabs) => {
    if (!this.isTabUnlocked(tab)) {
      return nothing;
    }

    return html` <sl-tab-panel name=${tab}> ${this.renderTabPanelContent(tab)} </sl-tab-panel> `;
  };

  private renderTabPanelContent = (tab: CompanyPageTabs) => {
    switch (tab) {
      case CompanyPageTabs.clones:
        return html`<ca-company-clones-panel></ca-company-clones-panel>`;

      case CompanyPageTabs.sidejobs:
        return html`<ca-company-sidejobs-panel></ca-company-sidejobs-panel>`;

      case CompanyPageTabs.contractAssignments:
        return html`<ca-company-contract-assignments-panel></ca-company-contract-assignments-panel>`;

      case CompanyPageTabs.primaryActivityQueue:
        return html`<ca-company-primary-activity-queue-panel></ca-company-primary-activity-queue-panel>`;
    }
  };
}
