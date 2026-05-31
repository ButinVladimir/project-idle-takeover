import { html } from 'lit';
import { map } from 'lit/directives/map.js';
import { localized, msg } from '@lit/localize';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, compareOptions, HINT_ICON, ISelectOption } from '@shared/index';
import { STATISTIC_HINTS, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { StatisticsConnectivityController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';
import { DISTRICT_NAMES } from '@/texts';

@localized()
@customElement('ca-statistics-connectivity')
export class StatisticsConnectivity extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsConnectivityController;

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsConnectivityController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">
          ${msg('Connectivity')}

          <sl-tooltip>
            <span slot="content"> ${STATISTIC_HINTS.connectivity()} </span>

            <sl-icon name=${HINT_ICON}></sl-icon>
          </sl-tooltip>
        </h4>

        <div class="parameters-table">${this.renderDistricts()}</div>
      </sl-details>
    `;
  }

  private renderDistricts = () => {
    const availableDistricts = this._controller.listAvailableDistricts();
    const districtOptions: ISelectOption<IDistrictState>[] = availableDistricts.map((district) => ({
      name: DISTRICT_NAMES[district.name](),
      value: district,
    }));

    districtOptions.sort(compareOptions);

    return map(districtOptions, this.renderDistrict);
  };

  private renderDistrict = (option: ISelectOption<IDistrictState>) => {
    return html`
      <div>${STATISTIC_PAGE_TEXTS.inDistrict(option.name)}</div>
      <div data-district=${option.value.index}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    this._districtValueNodes.forEach((element) => {
      const districtIndex = parseInt(element.dataset.district!);
      const value = this._controller.getDistrictConnectivity(districtIndex);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
