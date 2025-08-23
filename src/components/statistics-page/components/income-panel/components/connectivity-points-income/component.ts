import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { createRef, ref } from 'lit/directives/ref.js';
import { map } from 'lit/directives/map.js';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import { STATISTIC_HINTS, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { HINT_ICON } from '@shared/styles';
import { IDistrictState } from '@state/city-state';
import { StatisticsConnectivityPointsIncomeController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-connectivity-points-income')
export class StatisticsConnectivityPointsIncome extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsConnectivityPointsIncomeController;

  private _programPointsRef = createRef<HTMLDivElement>();

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsConnectivityPointsIncomeController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">
          ${msg('Connectivity points')}

          <sl-tooltip>
            <span slot="content"> ${STATISTIC_HINTS.connectivity()} </span>

            <sl-icon name=${HINT_ICON}></sl-icon>
          </sl-tooltip>
        </h4>

        <div class="parameters-table">
          <div>${STATISTIC_PAGE_TEXTS.byPrograms()}</div>
          <div ${ref(this._programPointsRef)}></div>

          ${map(this._controller.listAvailableDistricts(), this.renderDistrict)}
        </div>
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

    if (this._programPointsRef.value) {
      const pointsByProgram = this._controller.getPointsByProgram();

      this._programPointsRef.value.textContent = formatter.formatNumberFloat(pointsByProgram);
    }

    this._districtValueNodes.forEach((element) => {
      const districtIndex = parseInt(element.dataset.district!);
      const value = this._controller.getPointsByDistrict(districtIndex);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
