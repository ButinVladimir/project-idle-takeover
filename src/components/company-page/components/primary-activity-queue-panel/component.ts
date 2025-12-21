import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import styles from './styles';

@localized()
@customElement('ca-company-primary-activity-queue-panel')
export class CompanyPrimaryActivityQueuePanel extends BaseComponent {
  static styles = styles;

  renderDesktop() {
    return html`<div class="host-content desktop">${this.renderContent()}</div>`;
  }

  renderContent = () => {
    return html`
      <p class="hint">
        ${msg(`Primary activity can be added to the queue from corresponding panel. After it is finished, it has to be restarted manually or by using program.
All primary activity rewards are calculated at the start of the completion and won't change until activity is done.`)}
      </p>

      <ca-primary-activity-queue-list></ca-primary-activity-queue-list>
    `;
  };
}
