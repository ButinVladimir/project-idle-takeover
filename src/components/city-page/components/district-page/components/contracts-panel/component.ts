import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';
import { BaseComponent } from '@shared/index';
import { repeat } from 'lit/directives/repeat.js';
import { CityDistrictContractsPanelController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-city-district-contract-panel')
export class CityDistrictContractsPanel extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: CityDistrictContractsPanelController;

  constructor() {
    super();

    this._controller = new CityDistrictContractsPanelController(this);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  private renderContent = (showHeader: boolean) => {
    const contracts = this._controller.getAvailableContracts();

    return html`
      <p class="hint">
        ${msg(`Increase district connectivity to increase the chance of contract generation.
Teams of clones could be assigned to contracts on company page under contracts tab.`)}
      </p>

      <div class="list">
        ${showHeader ? this.renderHeader() : nothing}
        ${contracts.length > 0 ? this.renderList(contracts) : this.renderEmptyListNotification()}
      </div>
    `;
  };

  private renderHeader = () => {
    return html`
      <div class="header">
        <div class="header-column column-contract">${msg('Contract')}</div>
        <div class="header-column column-available">${msg('Available')}</div>
        <div class="header-column column-generation">${msg('Generation progress')}</div>
      </div>
    `;
  };

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg("You don't have any contracts available")}</div> `;
  };

  private renderList = (contracts: string[]) => {
    return html` ${repeat(contracts, (contract) => contract, this.renderContract)}`;
  };

  private renderContract = (contractName: string) => {
    return html`
      <ca-city-district-contracts-list-item contract-name=${contractName}></ca-city-district-contracts-list-item>
    `;
  };
}
