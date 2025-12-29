import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, CURRENT_VERSION } from '@shared/index';
import styles from './styles';

@localized()
@customElement('ca-credits-page')
export class CreditsPage extends BaseComponent {
  static styles = styles;

  protected renderDesktop() {
    return html`
      <h3 class="title">Project: Idle Takeover v${CURRENT_VERSION}</h3>

      <div class="server-links">
        <a target="_blank" href="https://discord.gg/CmsTxU2EMw">Discord</a>
        <a target="_blank" href="https://github.com/ButinVladimir/project-idle-takeover">GitHub</a>
      </div>

      <div class="contributors">
        <p>Vladimir Butin (OmniLRenegadE) - ${msg('Idea, coding, design, balance')}</p>
      </div>
    `;
  }
}
