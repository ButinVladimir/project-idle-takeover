import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/base-component';
import styles from './styles';

@customElement('ca-overview-progress-panel')
export class OverviewProgressPanel extends BaseComponent {
  static styles = styles;

  protected renderDesktop() {
    return html`
      <ca-overview-development-level-progress></ca-overview-development-level-progress>
      <ca-overview-reached-milestones-progress></ca-overview-reached-milestones-progress>
    `;
  }
}
