import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { map } from 'lit/directives/map.js';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
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

        <div class="parameters-table">${map(this._controller.listClones(), this.renderClone)}</div>
      </sl-details>
    `;
  }

  private renderClone = (clone: IClone) => {
    return html`
      <div>${clone.name}</div>
      <div data-clone=${clone.id}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    this._cloneValueNodes.forEach((element) => {
      const cloneId = element.dataset.clone!;
      const value = this._controller.getGrowthByClone(cloneId);

      element.textContent = formatter.formatNumberFloat(value);
    });
  };
}
