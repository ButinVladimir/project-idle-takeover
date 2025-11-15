import { html, nothing } from 'lit';
import { provide } from '@lit/context';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { COMMON_TEXTS } from '@texts/common';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { CLONE_TEMPLATE_TEXTS } from '@texts/clone-templates';
import { type IClone } from '@state/clones-state';
import { BaseComponent, CloneAlert, AUTOUPGRADE_VALUES } from '@shared/index';
import { ClonesListItemController } from './controller';
import { OpenCloneListItemDialogEvent } from '../../../../events/open-clone-list-item-dialog';
import { cloneContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-clones-list-item')
export class ClonesListItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'clone-id',
    type: String,
  })
  public cloneId!: string;

  private _controller: ClonesListItemController;

  @state()
  private _menuVisible = false;

  @state()
  private _detailsVisible = false;

  @provide({ context: cloneContext })
  private _clone?: IClone;

  constructor() {
    super();

    this._controller = new ClonesListItemController(this);
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener('click', this.handleHideMenu);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    document.removeEventListener('click', this.handleHideMenu);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  protected renderDesktop() {
    if (!this._clone) {
      return nothing;
    }

    const autoupgradeIcon = this._clone.autoUpgradeEnabled
      ? AUTOUPGRADE_VALUES.icon.enabled
      : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeLabel = this._clone.autoUpgradeEnabled
      ? COMMON_TEXTS.disableAutoupgrade()
      : COMMON_TEXTS.enableAutoupgrade();

    const formatter = this._controller.formatter;

    const formattedTier = formatter.formatTier(this._clone.tier);
    const formattedLevel = formatter.formatLevel(this._clone.level);

    return html`
      <sl-card>
        <div slot="header" class="header">
          <h4 class="title name" draggable="true" @dragstart=${this.handleDragStart}>
            <sl-icon id="drag-icon" name="grip-vertical"> </sl-icon>

            ${this._clone.name}

            <sl-tooltip>
              <span slot="content"> ${autoupgradeLabel} </span>

              <sl-icon-button
                id="toggle-autoupgrade-btn"
                name=${autoupgradeIcon}
                label=${autoupgradeLabel}
                @click=${this.handleToggleAutoUpgrade}
              >
              </sl-icon-button>
            </sl-tooltip>
          </h4>

          <p class="description hint">
            ${msg(
              str`${CLONE_TEMPLATE_TEXTS[this._clone.templateName].title()}, tier ${formattedTier}, level ${formattedLevel}`,
            )}
          </p>

          <sl-popup
            ?active=${this._menuVisible}
            flip
            placement="right-start"
            arrow
            arrow-placement="start"
            arrow-padding=${10}
            distance=${6}
          >
            <sl-icon-button
              class="menu-button"
              slot="anchor"
              label=${COMMON_TEXTS.menu()}
              name="three-dots-vertical"
              @click=${this.handleToggleMenu}
            ></sl-icon-button>

            <sl-menu>
              <sl-menu-item @click=${this.handleOpenRenameCloneDialog}>${msg('Rename clone')}</sl-menu-item>
              <sl-divider></sl-divider>
              <sl-menu-item @click=${this.handleOpenDeleteCloneDialog}>${msg('Delete clone')}</sl-menu-item>
            </sl-menu>
          </sl-popup>
        </div>

        <div>
          <ca-clones-list-item-experience></ca-clones-list-item-experience>

          ${this._detailsVisible
            ? html` <ca-clones-list-item-description></ca-clones-list-item-description> `
            : nothing}
        </div>

        <ca-clones-list-item-buttons
          slot="footer"
          ?details-visible=${this._detailsVisible}
          @toggle-details=${this.handleToggleDetails}
        ></ca-clones-list-item-buttons>
      </sl-card>
    `;
  }

  private updateContext() {
    if (this.cloneId) {
      this._clone = this._controller.getCloneById(this.cloneId);
    } else {
      this._clone = undefined;
    }
  }

  private handleToggleAutoUpgrade = () => {
    const clone = this._controller.getCloneById(this.cloneId);

    if (clone) {
      clone.autoUpgradeEnabled = !clone.autoUpgradeEnabled;
    }
  };

  private handleDragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.cloneId);
    }
  };

  private handleToggleMenu = (event: Event) => {
    event.stopPropagation();

    this._menuVisible = !this._menuVisible;
  };

  private handleHideMenu = () => {
    this._menuVisible = false;
  };

  private handleOpenDeleteCloneDialog = () => {
    this._menuVisible = false;

    const clone = this._controller.getCloneById(this.cloneId);

    if (!clone) {
      return;
    }

    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        CloneAlert.cloneDelete,
        msg(
          str`Are you sure want to delete clone "${clone.name}"? Their progress will be lost and their actions will be cancelled.`,
        ),
        this.handleDeleteClone,
      ),
    );
  };

  private handleDeleteClone = () => {
    this._controller.deleteCloneById(this.cloneId);
  };

  private handleOpenRenameCloneDialog = () => {
    if (!this._clone) {
      return;
    }

    this._menuVisible = false;

    this.dispatchEvent(new OpenCloneListItemDialogEvent('rename-clone', this._clone));
  };

  private handleToggleDetails = () => {
    this._detailsVisible = !this._detailsVisible;
  };
}
