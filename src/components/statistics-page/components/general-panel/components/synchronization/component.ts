import { html } from 'lit';
import { map } from 'lit/directives/map.js';
import { localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { STATISTIC_HINTS, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { BaseComponent, compareOptions, HINT_ICON, ISelectOption } from '@shared/index';
import { COMMON_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { StatisticsSynchronizationController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-synchronization')
export class StatisticsSynchronization extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  private _controller: StatisticsSynchronizationController;

  constructor() {
    super();

    this._controller = new StatisticsSynchronizationController(this);
  }

  protected renderDesktop() {
    const formatter = this._controller.formatter;

    const formattedBaseValue = formatter.formatNumberDecimal(this._controller.baseValue);
    const formattedTotalValue = formatter.formatNumberDecimal(this._controller.totalValue);

    return html`
      <sl-details>
        <h4 class="title" slot="summary">
          ${COMMON_TEXTS.synchronization()}

          <sl-tooltip>
            <span slot="content"> ${STATISTIC_HINTS.synchronization()} </span>

            <sl-icon name=${HINT_ICON}></sl-icon>
          </sl-tooltip>
        </h4>

        <div class="parameters-table">
          <div>${STATISTIC_PAGE_TEXTS.baseValue()}</div>
          <div>${formattedBaseValue}</div>

          ${this.renderDistricts()}

          <div>${STATISTIC_PAGE_TEXTS.total()}</div>
          <div>${formattedTotalValue}</div>
        </div>
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
    const formattedValue = this._controller.formatter.formatNumberDecimal(
      this._controller.getDistrictSynchronization(option.value.index),
    );

    return html`
      <div>${STATISTIC_PAGE_TEXTS.byDistrict(option.name)}</div>
      <div>${formattedValue}</div>
    `;
  };
}
