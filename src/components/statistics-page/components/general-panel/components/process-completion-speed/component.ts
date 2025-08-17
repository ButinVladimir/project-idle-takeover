import { html, nothing } from 'lit';
import { map } from 'lit/directives/map.js';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, IncomeSource } from '@shared/index';
import { INCOME_SOURCE_NAMES, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { StatisticsProcessCompletionSpeedController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-process-completion-speed')
export class StatisticsProcessCompletionSpeed extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  private _controller: StatisticsProcessCompletionSpeedController;

  constructor() {
    super();

    this._controller = new StatisticsProcessCompletionSpeedController(this);
  }

  protected renderDesktop() {
    const formatter = this._controller.formatter;

    const { totalMultiplier, multiplierByHardware, multiplierByProgram } = this._controller;

    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Process completion speed multipliers')}</h4>

        <div class="parameters-table">
          <div>${msg('By hardware')}</div>
          <div>${formatter.formatNumberFloat(multiplierByHardware)}</div>

          <div>${INCOME_SOURCE_NAMES[IncomeSource.program]()}</div>
          <div>${formatter.formatNumberFloat(multiplierByProgram)}</div>

          ${this.renderDistricts()}

          <div>${STATISTIC_PAGE_TEXTS.total()}</div>
          <div>${formatter.formatNumberFloat(totalMultiplier)}</div>
        </div>
      </sl-details>
    `;
  }

  private renderDistricts = () => {
    if (!this._controller.areDistrictsAvailable()) {
      return nothing;
    }

    return html`${map(this._controller.listAvailableDistricts(), this.renderDistrict)}`;
  };

  private renderDistrict = (districtState: IDistrictState) => {
    const processCompletionSpeed = districtState.parameters.processCompletionSpeed.value;

    return html`
      <div>${STATISTIC_PAGE_TEXTS.byDistrict(districtState.name)}</div>
      <div>${this._controller.formatter.formatNumberFloat(processCompletionSpeed)}</div>
    `;
  };
}
