import { html, nothing } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement, queryAll } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { BaseComponent, IncomeSource } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { INCOME_SOURCE_NAMES, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { StatisticsExperienceShareController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-experience-share')
export class StatisticsExperienceShare extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsExperienceShareController;

  private _programMultiplierRef = createRef<HTMLDivElement>();
  private _totalMultiplierRef = createRef<HTMLDivElement>();

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsExperienceShareController(this);
  }

  protected renderDesktop() {
    const formatter = this._controller.formatter;

    const { baseMultiplier, multiplierBySynchronization } = this._controller;

    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Shared experience multipliers')}</h4>

        <div class="parameters-table">
          <div>${STATISTIC_PAGE_TEXTS.baseValue()}</div>
          <div>${formatter.formatNumberFloat(baseMultiplier)}</div>

          <div>${msg('By synchronization')}</div>
          <div>${formatter.formatNumberFloat(multiplierBySynchronization)}</div>

          <div>${INCOME_SOURCE_NAMES[IncomeSource.program]()}</div>
          <div ${ref(this._programMultiplierRef)}></div>

          ${this.renderDistricts()}

          <div>${STATISTIC_PAGE_TEXTS.total()}</div>
          <div ${ref(this._totalMultiplierRef)}></div>
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
    return html`
      <div>${STATISTIC_PAGE_TEXTS.byDistrict(districtState.name)}</div>
      <div data-district=${districtState.index}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    if (this._programMultiplierRef.value) {
      const programMultiplier = this._controller.multiplierByProgram;
      this._programMultiplierRef.value.textContent = formatter.formatNumberFloat(programMultiplier);
    }

    this._districtValueNodes.forEach((element) => {
      const districtIndex = parseInt(element.dataset.district!);
      const value = this._controller.getDistrictMultiplier(districtIndex);

      element.textContent = formatter.formatNumberFloat(value);
    });

    if (this._totalMultiplierRef.value) {
      const totalMultiplier = this._controller.totalMultiplier;
      this._totalMultiplierRef.value.textContent = formatter.formatNumberFloat(totalMultiplier);
    }
  };
}
