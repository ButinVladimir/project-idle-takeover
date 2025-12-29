import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import { Milestone } from '@shared/types';
import { statisticsPanelStyle } from '../../styles';
import { StatisticsIncomePanelController } from './controller';

@customElement('ca-statistics-income-panel')
export class StatisticsIncomePanel extends BaseComponent {
  static styles = statisticsPanelStyle;

  private _controller: StatisticsIncomePanelController;

  constructor() {
    super();

    this._controller = new StatisticsIncomePanelController(this);
  }

  protected renderDesktop() {
    return html`
      <ca-statistics-money-income></ca-statistics-money-income>

      <ca-statistics-development-income></ca-statistics-development-income>

      ${this._controller.isMilestoneUnlocked(Milestone.unlockedCompanyManagement)
        ? html`<ca-statistics-experience-income></ca-statistics-experience-income>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedInfluence)
        ? html`<ca-statistics-influence-points-income></ca-statistics-influence-points-income>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedConnectivity)
        ? html`<ca-statistics-connectivity-points-income></ca-statistics-connectivity-points-income>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedRewards)
        ? html`<ca-statistics-rewards-points-income></ca-statistics-rewards-points-income>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedCodeBase)
        ? html`<ca-statistics-multiplier-points-income type="codeBase"></ca-statistics-multiplier-points-income>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedComputationalBase)
        ? html`<ca-statistics-multiplier-points-income
            type="computationalBase"
          ></ca-statistics-multiplier-points-income>`
        : nothing}
    `;
  }
}
