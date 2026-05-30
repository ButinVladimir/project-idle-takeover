import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { map } from 'lit/directives/map.js';
import { localized } from '@lit/localize';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { BaseComponent, compareOptions, ISelectOption } from '@shared/index';
import { STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { DISTRICT_NAMES } from '@texts/index';
import { StatisticsMultipliersController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';
import type { MultipliersType } from '../../types';
import { STATISTIC_MULTIPLIER_TITLES } from './constants';

@localized()
@customElement('ca-statistics-multipliers')
export class StatisticsMultipliers extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  @property({
    attribute: true,
  })
  type!: MultipliersType;

  private _controller: StatisticsMultipliersController;

  private _programMultiplierRef = createRef<HTMLDivElement>();
  private _totalMultiplierRef = createRef<HTMLDivElement>();

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsMultipliersController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${STATISTIC_MULTIPLIER_TITLES[this.type]()}</h4>

        <div class="parameters-table">
          <div>${STATISTIC_PAGE_TEXTS.byPrograms()}</div>
          <div ${ref(this._programMultiplierRef)}></div>

          ${this.renderDistricts()}

          <div>${STATISTIC_PAGE_TEXTS.total()}</div>
          <div ${ref(this._totalMultiplierRef)}></div>
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
    return html`
      <div>${STATISTIC_PAGE_TEXTS.byDistrict(option.name)}</div>
      <div data-district=${option.value.index}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    if (this._programMultiplierRef.value) {
      const programMultiplier = this._controller.getProgramMultiplier(this.type);
      this._programMultiplierRef.value.textContent = formatter.formatNumberFloat(programMultiplier);
    }

    if (this._totalMultiplierRef.value) {
      const totalMultiplier = this._controller.getTotalMultiplier(this.type);
      this._totalMultiplierRef.value.textContent = formatter.formatNumberFloat(totalMultiplier);
    }

    this._districtValueNodes.forEach((element) => {
      const districtIndex = parseInt(element.dataset.district!);
      const value = this._controller.getDistrictMultiplier(districtIndex, this.type);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
