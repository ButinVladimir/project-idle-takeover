import { html, nothing } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { BaseComponent, IncomeSource } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { INCOME_SOURCE_NAMES, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { StatisticsExperienceShareController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-experience-share')
export class StatisticsExperienceShare extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  private _controller: StatisticsExperienceShareController;

  constructor() {
    super();

    this._controller = new StatisticsExperienceShareController(this);
  }

  protected renderDesktop() {
    const formatter = this._controller.formatter;

    const { baseMultiplier, totalMultiplier, multiplierBySynchronization, multiplierByProgram } = this._controller;

    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Shared experience multipliers')}</h4>

        <div class="parameters-table">
          <div>${STATISTIC_PAGE_TEXTS.baseValue()}</div>
          <div>${formatter.formatNumberFloat(baseMultiplier)}</div>

          <div>${msg('By synchronization')}</div>
          <div>${formatter.formatNumberFloat(multiplierBySynchronization)}</div>

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
    const processCompletionSpeed = districtState.parameters.experienceShareMultiplier.value;

    return html`
      <div>${STATISTIC_PAGE_TEXTS.byDistrict(districtState.name)}</div>
      <div>${this._controller.formatter.formatNumberFloat(processCompletionSpeed)}</div>
    `;
  };
}
