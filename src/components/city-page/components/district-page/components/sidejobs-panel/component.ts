import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';
import { BaseComponent } from '@shared/index';
import { SidejobName } from '@state/company-state';
import { repeat } from 'lit/directives/repeat.js';
import { CityDistrictSidejobsPanelController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-city-district-sidejobs-panel')
export class CityDistrictSidejobsPanel extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: CityDistrictSidejobsPanelController;

  constructor() {
    super();

    this._controller = new CityDistrictSidejobsPanelController(this);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  private renderContent = (showHeader: boolean) => {
    const sidejobs = this._controller.getAvailableSidejobs();

    return html`
      <p class="hint">
        ${msg(`Increase district connectivity to make sidejobs available.
Clones could be assigned to sidejobs on company page under sidejobs tab.`)}
      </p>

      <div class="list">
        ${showHeader ? this.renderHeader() : nothing}
        ${sidejobs.length > 0 ? this.renderList(sidejobs) : this.renderEmptyListNotification()}
      </div>
    `;
  };

  private renderHeader = () => {
    return html`
      <div class="header">
        <div class="header-column column-sidejob">${msg('Sidejob')}</div>
        <div class="header-column column-progress">${msg('Unlock progress')}</div>
      </div>
    `;
  };

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg("You don't have any sidejobs available")}</div> `;
  };

  private renderList = (sidejobs: SidejobName[]) => {
    return html` ${repeat(sidejobs, (sidejob) => sidejob, this.renderSidejob)}`;
  };

  private renderSidejob = (sidejobName: SidejobName) => {
    return html`
      <ca-city-district-sidejobs-list-item sidejob-name=${sidejobName}> </ca-city-district-sidejobs-list-item>
    `;
  };
}
