import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import { FactionsPageController } from './controller';
import { FactionsPageTabs } from './types';
import { FACTIONS_PAGE_TABS_LIST } from './constants';
import styles from './styles';

@localized()
@customElement('ca-factions-page')
export class FactionsPage extends BaseComponent {
  static styles = styles;

  private _controller: FactionsPageController;

  constructor() {
    super();

    this._controller = new FactionsPageController(this);
  }

  protected renderDesktop() {
    return html`
      <h3 class="title">${msg('Factions')}</h3>

      <sl-tab-group>
        ${FACTIONS_PAGE_TABS_LIST.map(this.renderTab)} ${FACTIONS_PAGE_TABS_LIST.map(this.renderTabPanel)}
      </sl-tab-group>
    `;
  }

  private renderTab = (tab: FactionsPageTabs) => {
    let title = '';

    if (tab === FactionsPageTabs.faction) {
      title = this._controller.isFactionSelected() ? msg('Current faction') : msg('Available factions');
    }

    return html` <sl-tab slot="nav" panel=${tab}> ${title} </sl-tab> `;
  };

  private renderTabPanel = (tab: FactionsPageTabs) => {
    return html` <sl-tab-panel name=${tab}> ${this.renderTabPanelContent(tab)} </sl-tab-panel> `;
  };

  private renderTabPanelContent = (tab: FactionsPageTabs) => {
    switch (tab) {
      case FactionsPageTabs.faction:
        if (this._controller.isFactionSelected()) {
          return html`<ca-factions-current-faction-panel></ca-factions-current-faction-panel>`;
        }
        return html`<ca-factions-available-factions-panel></ca-factions-available-factions-panel>`;
    }
  };
}
