import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import { Feature } from '@shared/types';
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

      ${this._controller.isFeatureUnlocked(Feature.companyManagement)
        ? html`<ca-statistics-experience-income></ca-statistics-experience-income>`
        : nothing}
      ${this._controller.isFeatureUnlocked(Feature.districtTiers)
        ? html`<ca-statistics-district-tier-points-income></ca-statistics-district-tier-points-income>`
        : nothing}
      ${this._controller.isFeatureUnlocked(Feature.connectivity)
        ? html`<ca-statistics-connectivity-points-income></ca-statistics-connectivity-points-income>`
        : nothing}
      ${this._controller.isFeatureUnlocked(Feature.rewards)
        ? html`<ca-statistics-rewards-points-income></ca-statistics-rewards-points-income>`
        : nothing}
      ${this._controller.isFeatureUnlocked(Feature.codeBase)
        ? html`<ca-statistics-multiplier-points-income type="codeBase"></ca-statistics-multiplier-points-income>`
        : nothing}
      ${this._controller.isFeatureUnlocked(Feature.computationalBase)
        ? html`<ca-statistics-multiplier-points-income
            type="computationalBase"
          ></ca-statistics-multiplier-points-income>`
        : nothing}
    `;
  }
}
