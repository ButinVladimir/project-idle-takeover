import { html } from 'lit';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { localized, msg } from '@lit/localize';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, compareOptions, HINT_ICON, ISelectOption } from '@shared/index';
import { STATISTIC_HINTS, STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { IDistrictState } from '@state/city-state';
import { DISTRICT_NAMES } from '@texts/index';
import { StatisticsRewardsController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-rewards')
export class StatisticsRewards extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsRewardsController;

  private _programMultiplierRef = createRef<HTMLDivElement>();

  @queryAll('div[data-district]')
  private _districtValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsRewardsController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">
          ${msg('Rewards multipliers')}

          <sl-tooltip>
            <span slot="content"> ${STATISTIC_HINTS.rewards()} </span>

            <sl-icon name=${HINT_ICON}></sl-icon>
          </sl-tooltip>
        </h4>

        <div class="parameters-table">
          <div>${STATISTIC_PAGE_TEXTS.byPrograms()}</div>
          <div ${ref(this._programMultiplierRef)}></div>

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
      <div>${STATISTIC_PAGE_TEXTS.inDistrict(option.name)}</div>
      <div data-district=${option.value.index}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    if (this._programMultiplierRef.value) {
      const programMultiplier = this._controller.getProgramRewards();
      this._programMultiplierRef.value.textContent = formatter.formatNumberFloat(programMultiplier);
    }

    this._districtValueNodes.forEach((element) => {
      const districtIndex = parseInt(element.dataset.district!);
      const value = this._controller.getDistrictRewards(districtIndex);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
