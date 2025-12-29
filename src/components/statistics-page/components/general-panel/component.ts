import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import { Milestone } from '@shared/types';
import { StatisticsGeneralPanelController } from './controller';
import { statisticsPanelStyle } from '../../styles';

@customElement('ca-statistics-general-panel')
export class StatisticsGeneralPanel extends BaseComponent {
  static styles = statisticsPanelStyle;

  private _controller: StatisticsGeneralPanelController;

  constructor() {
    super();

    this._controller = new StatisticsGeneralPanelController(this);
  }

  protected renderDesktop() {
    return html`
      <ca-statistics-game-time></ca-statistics-game-time>

      <ca-statistics-process-completion-speed></ca-statistics-process-completion-speed>

      ${this._controller.isMilestoneUnlocked(Milestone.unlockedExperienceShare)
        ? html`<ca-statistics-experience-share></ca-statistics-experience-share>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedCompanyManagement)
        ? html`<ca-statistics-synchronization></ca-statistics-synchronization>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedConnectivity)
        ? html`<ca-statistics-connectivity></ca-statistics-connectivity>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedRewards)
        ? html`<ca-statistics-rewards></ca-statistics-rewards>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedMainframePrograms)
        ? html`<ca-statistics-multipliers type="mainframeProgramsCostDivisors"></ca-statistics-multipliers>`
        : nothing}
      ${this._controller.isMilestoneUnlocked(Milestone.unlockedMainframeHardware)
        ? html`<ca-statistics-multipliers type="mainframeHardwareCostDivisors"></ca-statistics-multipliers>`
        : nothing}
    `;
  }
}
