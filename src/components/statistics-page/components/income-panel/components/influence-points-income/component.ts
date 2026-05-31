import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { map } from 'lit/directives/map.js';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, compareOptions, ISelectOption } from '@shared/index';
import { STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { DISTRICT_NAMES } from '@texts/index';
import { StatisticsInfluencePointsIncomeController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-influence-points-income')
export class StatisticsInfluencePointsIncome extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsInfluencePointsIncomeController;

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsInfluencePointsIncomeController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Faction influence points')}</h4>

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
      const value = this._controller.getPointsByDistrict(districtIndex);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
