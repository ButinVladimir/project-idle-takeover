import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import { MILESTONES } from '@shared/constants';
import { calculateLevelProgressPercentage } from '@shared/helpers';
import { OverviewReachedMilestonesProgressController } from './controller';
import { progressBlockStyle } from '../../styles';

@localized()
@customElement('ca-overview-reached-milestones-progress')
export class OverviewReachedMilestonesProgress extends BaseComponent {
  static styles = progressBlockStyle;

  private _controller: OverviewReachedMilestonesProgressController;

  constructor() {
    super();

    this._controller = new OverviewReachedMilestonesProgressController(this);
  }

  protected renderDesktop() {
    const formatter = this._controller.formatter;

    const reachedMilestonesCount = this._controller.getReachedMilestonesCount();
    const reachedMilestonesMaxCount = MILESTONES.length;

    const formattedCount = formatter.formatNumberDecimal(reachedMilestonesCount);
    const formattedMaxCount = formatter.formatNumberDecimal(reachedMilestonesMaxCount);

    const reachedMilestonesProgressBarValue = calculateLevelProgressPercentage(
      0,
      reachedMilestonesCount,
      reachedMilestonesMaxCount,
    );
    const reachedMilestonesProgressBarPercentage = `${formattedCount}/${formattedMaxCount}`;

    return html`
      <div class="block">
        <div class="title">${msg('Reached milestones progress')}</div>

        <sl-progress-bar value=${reachedMilestonesProgressBarValue}>
          ${reachedMilestonesProgressBarPercentage}
        </sl-progress-bar>
      </div>
    `;
  }
}
