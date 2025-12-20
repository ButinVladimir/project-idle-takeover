import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, Milestone } from '@shared/index';
import { AutomationAutobuyersPanelController } from './controller';
import automationPageAutobuyersPanelStyles from './styles';

@customElement('ca-automation-autobuyers-panel')
export class AutomationAutobuyersPanel extends BaseComponent {
  static styles = automationPageAutobuyersPanelStyles;

  private _controller: AutomationAutobuyersPanelController;

  constructor() {
    super();

    this._controller = new AutomationAutobuyersPanelController(this);
  }

  protected renderDesktop() {
    return html`
      ${this._controller.isMilestoneReached(Milestone.unlockedCompanyManagement)
        ? html`<ca-automation-clone-level-autoupgrader></ca-automation-clone-level-autoupgrader>`
        : nothing}
      ${this._controller.isMilestoneReached(Milestone.unlockedAutomationMainframeHardware)
        ? html`<ca-automation-mainframe-hardware-autobuyer></ca-automation-mainframe-hardware-autobuyer>`
        : nothing}
      ${this._controller.isMilestoneReached(Milestone.unlockedAutomationMainframePrograms)
        ? html`<ca-automation-mainframe-programs-autobuyer></ca-automation-mainframe-programs-autobuyer>`
        : nothing}
    `;
  }
}
