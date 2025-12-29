import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BaseComponent } from '@shared/index';
import { FactionsAvailableFactionsListController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-factions-available-factions-list')
export class FactionsAvailableFactionsList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: FactionsAvailableFactionsListController;

  constructor() {
    super();

    this._controller = new FactionsAvailableFactionsListController(this);
  }

  protected renderDesktop() {
    return html`
      <div class="list desktop">
        <div class="header">${msg('Faction')}</div>

        ${this.renderList()}
      </div>
    `;
  }

  protected renderMobile() {
    return html` <div class="list mobile">${this.renderList()}</div> `;
  }

  private renderList = () => {
    const availableFactions = this._controller.listAvailableFactions();

    if (!this._controller.isJoiningFactionAvailable() || availableFactions.length === 0) {
      return html`<div class="notification">${msg(`You don't have factions available to join`)}</div>`;
    }

    return html` ${repeat(availableFactions, (faction) => faction, this.renderFaction)} `;
  };

  private renderFaction = (faction: string) => {
    return html`
      <ca-factions-available-factions-list-item faction=${faction}></ca-factions-available-factions-list-item>
    `;
  };
}
