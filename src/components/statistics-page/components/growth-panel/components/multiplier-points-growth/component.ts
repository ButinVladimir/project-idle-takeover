import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { map } from 'lit/directives/map.js';
import { localized } from '@lit/localize';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { BaseComponent, compareOptions, HINT_ICON, ISelectOption, type PointsMultiplierType } from '@shared/index';
import { POINT_MULTIPLIER_HINTS, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { DISTRICT_NAMES } from '@texts/index';
import { StatisticsMultiplierPointsGrowthController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';
import { MULTIPLIER_POINT_GROWTH_TITLES } from './constants';

@localized()
@customElement('ca-statistics-multiplier-points-growth')
export class StatisticsMultiplierPointsGrowth extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  @property({
    attribute: true,
  })
  type!: PointsMultiplierType;

  private _controller: StatisticsMultiplierPointsGrowthController;

  private _programGrowthRef = createRef<HTMLDivElement>();

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsMultiplierPointsGrowthController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">
          ${MULTIPLIER_POINT_GROWTH_TITLES[this.type]()}

          <sl-tooltip>
            <span slot="content"> ${POINT_MULTIPLIER_HINTS[this.type]()} </span>

            <sl-icon name=${HINT_ICON}></sl-icon>
          </sl-tooltip>
        </h4>

        <div class="parameters-table">
          <div>${STATISTIC_PAGE_TEXTS.byPrograms()}</div>
          <div ${ref(this._programGrowthRef)}></div>

          ${this.renderDistricts()}
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

    if (this._programGrowthRef.value) {
      const growthByProgram = this._controller.getGrowthByProgram(this.type);

      this._programGrowthRef.value.textContent = formatter.formatNumberFloat(growthByProgram);
    }

    this._districtValueNodes.forEach((element) => {
      const districtIndex = parseInt(element.dataset.district!);
      const value = this._controller.getGrowthByDistrict(this.type, districtIndex);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
