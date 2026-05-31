import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { map } from 'lit/directives/map.js';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, compareOptions, ISelectOption, MS_IN_SECOND } from '@shared/index';
import { IClone } from '@state/clones-state';
import { StatisticsExperienceGrowthController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-experience-growth')
export class StatisticsExperienceGrowth extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsExperienceGrowthController;

  @queryAll('div[data-clone]')
  private _cloneValueNodes!: NodeListOf<HTMLDivElement>;

  constructor() {
    super();

    this._controller = new StatisticsExperienceGrowthController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Experience per second')}</h4>

        <div class="parameters-table">${this.renderClones()}</div>
      </sl-details>
    `;
  }

  private renderClones = () => {
    const clones = this._controller.listClones();
    const cloneOptions: ISelectOption<IClone>[] = clones.map((clone) => ({
      name: clone.name,
      value: clone,
    }));

    cloneOptions.sort(compareOptions);

    return map(cloneOptions, this.renderClone);
  };

  private renderClone = (option: ISelectOption<IClone>) => {
    return html`
      <div>${option.name}</div>
      <div data-clone=${option.value.id}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    this._cloneValueNodes.forEach((element) => {
      const cloneId = element.dataset.clone!;
      const value = this._controller.getGrowthByClone(cloneId) * MS_IN_SECOND;

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
