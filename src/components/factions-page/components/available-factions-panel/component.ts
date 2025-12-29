import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import styles from './styles';

@localized()
@customElement('ca-factions-available-factions-panel')
export class FactionsAvailableFactionsPanel extends BaseComponent {
  static styles = styles;

  protected renderDesktop() {
    return html`
      <p class="hint">
        ${msg(`Join a faction to get access to it's loaned items and contracts. 
Joined faction cannot be switched until transfer.`)}
      </p>

      <ca-factions-available-factions-list></ca-factions-available-factions-list>
    `;
  }
}
