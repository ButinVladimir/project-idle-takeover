import { html, nothing } from 'lit';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { msg, localized } from '@lit/localize';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, compareOptions, IncomeSource, ISelectOption } from '@shared/index';
import { INCOME_SOURCE_NAMES, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { DISTRICT_NAMES } from '@texts/index';
import { StatisticsProcessCompletionSpeedController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-process-completion-speed')
export class StatisticsProcessCompletionSpeed extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsProcessCompletionSpeedController;

  private _programMultiplierRef = createRef<HTMLDivElement>();
  private _totalMultiplierRef = createRef<HTMLDivElement>();

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsProcessCompletionSpeedController(this);
  }

  protected renderDesktop() {
    const formatter = this._controller.formatter;

    const { multiplierByHardware } = this._controller;

    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Process completion speed multipliers')}</h4>

        <div class="parameters-table">
          <div>${msg('By hardware')}</div>
          <div>${formatter.formatNumberFloat(multiplierByHardware)}</div>

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
      <div>${STATISTIC_PAGE_TEXTS.byDistrict(option.name)}</div>
      <div data-district=${option.value.index}></div>
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
