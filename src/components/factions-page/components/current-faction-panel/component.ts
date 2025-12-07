import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, HINT_ICON } from '@shared/index';
import { COMMON_TEXTS, FACTION_TEXTS } from '@texts/index';
import { FactionsCurrentFactionPanelController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-factions-current-faction-panel')
export class FactionsCurrentFactionPanel extends BaseComponent {
  static styles = styles;

  private _controller: FactionsCurrentFactionPanelController;

  constructor() {
    super();

    this._controller = new FactionsCurrentFactionPanelController(this);
  }
  protected renderDesktop() {
    const currentFaction = this._controller.currentFaction;

    return html`
      <p class="text">
        ${COMMON_TEXTS.parameterRow(msg('Current faction'), FACTION_TEXTS[currentFaction].title())}

        <sl-tooltip>
          <span slot="content">${FACTION_TEXTS[currentFaction].overview()}</span>

          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </p>
    `;
  }
}
