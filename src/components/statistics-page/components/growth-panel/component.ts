import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import { Milestone } from '@shared/types';
import { statisticsPanelStyle } from '../../styles';
import { StatisticsGrowthPanelController } from './controller';

@customElement('ca-statistics-growth-panel')
export class StatisticsGrowthPanel extends BaseComponent {
  static styles = statisticsPanelStyle;

  private _controller: StatisticsGrowthPanelController;

  constructor() {
    super();

    this._controller = new StatisticsGrowthPanelController(this);
  }

  protected renderDesktop() {
    return html`
      <ca-statistics-money-growth></ca-statistics-money-growth>

      <ca-statistics-development-growth></ca-statistics-development-growth>

      ${this._controller.isMilestoneUnlocked(Milestone.unlockedCompanyManagement)
        ? html`<ca-statistics-experience-growth></ca-statistics-experience-growth>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedInfluence)
        ? html`<ca-statistics-influence-points-growth></ca-statistics-influence-points-growth>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedConnectivity)
        ? html`<ca-statistics-connectivity-points-growth></ca-statistics-connectivity-points-growth>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedRewards)
        ? html`<ca-statistics-rewards-points-growth></ca-statistics-rewards-points-growth>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedCodeBase)
        ? html`<ca-statistics-multiplier-points-growth type="codeBase"></ca-statistics-multiplier-points-growth>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedComputationalBase)
        ? html`<ca-statistics-multiplier-points-growth
            type="computationalBase"
          ></ca-statistics-multiplier-points-growth>`
        : nothing}
    `;
  }
}
