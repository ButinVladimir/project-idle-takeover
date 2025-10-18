import { html } from 'lit';
import { msg, localized, str } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, type Faction, GameStateAlert, HINT_ICON } from '@shared/index';
import { FACTION_TEXTS } from '@texts/index';
import { FactionsAvailableFactionsListItemController } from './controller';
import styles from './styles';
import { classMap } from 'lit/directives/class-map.js';

@localized()
@customElement('ca-factions-available-factions-list-item')
export class FactionsAvailableFactionsListItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'faction',
    type: String,
  })
  faction!: Faction;

  protected hasMobileRender = true;

  private _controller: FactionsAvailableFactionsListItemController;

  constructor() {
    super();

    this._controller = new FactionsAvailableFactionsListItemController(this);
  }

  protected renderDesktop() {
    return this.renderContent(false);
  }

  protected renderMobile() {
    return this.renderContent(true);
  }

  private renderContent(mobile: boolean) {
    const listItemClasses = classMap({
      'list-item': true,
      desktop: !mobile,
      mobile: mobile,
    });

    return html`
      <div class=${listItemClasses} part="base">
        <div>
          ${FACTION_TEXTS[this.faction].title()}
          <sl-tooltip>
            <span slot="content">${FACTION_TEXTS[this.faction].overview()}</span>

            <sl-icon name=${HINT_ICON}></sl-icon>
          </sl-tooltip>
        </div>
        <div>
          <sl-button type="button" size="medium" variant="primary" @click=${this.handleOpenConfirmationDialog}
            >${msg('Join faction')}</sl-button
          >
        </div>
      </div>
    `;
  }

  private handleOpenConfirmationDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        GameStateAlert.joinFaction,
        msg(str`Are you sure want to join faction ${FACTION_TEXTS[this.faction].title()}? 
You cannot switch factions until transfer.`),
        this.handleJoinFaction,
      ),
    );
  };

  private handleJoinFaction = () => {
    this._controller.joinFaction(this.faction);
  };
}
