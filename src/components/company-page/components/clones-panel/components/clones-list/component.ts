import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { COMMON_TEXTS } from '@texts/index';
import { BaseComponent, CloneAlert, AUTOUPGRADE_VALUES, DELETE_VALUES } from '@shared/index';
import { IClone } from '@state/clones-state';
import { ClonesListController } from './controller';
import { CLONE_LIST_ITEMS_GAP } from './constants';
import styles from './styles';

@localized()
@customElement('ca-clones-list')
export class ClonesList extends BaseComponent {
  static styles = styles;

  private _controller: ClonesListController;

  constructor() {
    super();

    this._controller = new ClonesListController(this);
  }

  protected renderDesktop() {
    const isAutoupgradeActive = this.checkSomeClonesAutoupgradeActive();

    const autoupgradeLabel = isAutoupgradeActive
      ? COMMON_TEXTS.disableAutoupgradeAll()
      : COMMON_TEXTS.enableAutoupgradeAll();
    const autoupgradeIcon = isAutoupgradeActive ? AUTOUPGRADE_VALUES.icon.enabled : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeVariant = isAutoupgradeActive
      ? AUTOUPGRADE_VALUES.buttonVariant.enabled
      : AUTOUPGRADE_VALUES.buttonVariant.disabled;

    const clones = this._controller.listClones();

    return html`
      <div class="header-row with-border">
        <ca-clones-list-upgrade-buttons></ca-clones-list-upgrade-buttons>
      </div>

      <div class="header-row">
        <sl-button variant=${autoupgradeVariant} size="medium" @click=${this.handleToggleAutoupgrade}>
          <sl-icon slot="prefix" name=${autoupgradeIcon}></sl-icon>

          ${autoupgradeLabel}
        </sl-button>

        <sl-button variant=${DELETE_VALUES.buttonVariant} size="medium" @click=${this.handleOpenDeleteAllClonesDialog}>
          <sl-icon slot="prefix" name=${DELETE_VALUES.icon}></sl-icon>

          ${msg('Delete all clones')}
        </sl-button>
      </div>

      ${clones.length > 0
        ? html`
            <ca-sortable-list gap=${CLONE_LIST_ITEMS_GAP} @sortable-element-moved=${this.handleMoveClone}>
              ${repeat(clones, (clone) => clone.id, this.renderClone)}
            </ca-sortable-list>
          `
        : this.renderEmptyListNotification()}
    `;
  }

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg("You don't have any clones")}</div> `;
  };

  private renderClone = (clone: IClone) => {
    return html`<ca-clones-list-item clone-id=${clone.id} data-drag-id=${clone.id}></ca-clones-list-item>`;
  };

  private checkSomeClonesAutoupgradeActive(): boolean {
    const clones = this._controller.listClones();

    return clones.some((clone) => clone.autoUpgradeEnabled);
  }

  private handleToggleAutoupgrade = () => {
    const active = this.checkSomeClonesAutoupgradeActive();

    this._controller.toggleAutoupgrade(!active);
  };

  private handleMoveClone = (event: SortableElementMovedEvent) => {
    this._controller.moveClone(event.keyName, event.position);
  };

  private handleOpenDeleteAllClonesDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        CloneAlert.deleteAllClones,
        msg('Are you sure want to delete all clones? Their progress will be lost and their actions will be cancelled.'),
        this.handleDeleteAllClones,
      ),
    );
  };

  private handleDeleteAllClones = () => {
    this._controller.deleteAllClones();
  };
}
