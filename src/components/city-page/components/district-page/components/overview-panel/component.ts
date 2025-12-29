import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { localized } from '@lit/localize';
import { BaseComponent } from '@shared/base-component';
import { CityDistrictOverviewPanelController } from './controller';
import cityDistrictPageOverviewPanelStyles from './styles';

@localized()
@customElement('ca-city-district-overview-panel')
export class CityDistrictOverviewPanel extends BaseComponent {
  static styles = cityDistrictPageOverviewPanelStyles;

  private _controller: CityDistrictOverviewPanelController;

  constructor() {
    super();

    this._controller = new CityDistrictOverviewPanelController(this);
  }

  protected renderDesktop() {
    return html`
      <ca-city-district-overview-panel-values></ca-city-district-overview-panel-values>

      ${this._controller.isInfluenceAvailable()
        ? html`<ca-city-district-overview-panel-next-tier-progress></ca-city-district-overview-panel-next-tier-progress>`
        : nothing}
    `;
  }
}
