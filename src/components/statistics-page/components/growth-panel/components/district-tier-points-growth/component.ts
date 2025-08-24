import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { map } from 'lit/directives/map.js';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import { STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { StatisticsDistrictTierPointsGrowthController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-district-tier-points-growth')
export class StatisticsDistrictTierPointsGrowth extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsDistrictTierPointsGrowthController;

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsDistrictTierPointsGrowthController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('District tier points per second')}</h4>

        <div class="parameters-table">${map(this._controller.listAvailableDistricts(), this.renderDistrict)}</div>
      </sl-details>
    `;
  }

  private renderDistrict = (districtState: IDistrictState) => {
    return html`
      <div>${STATISTIC_PAGE_TEXTS.inDistrict(districtState.name)}</div>
      <div data-district=${districtState.index}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    this._districtValueNodes.forEach((element) => {
      const districtIndex = parseInt(element.dataset.district!);
      const value = this._controller.getGrowthByDistrict(districtIndex);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
