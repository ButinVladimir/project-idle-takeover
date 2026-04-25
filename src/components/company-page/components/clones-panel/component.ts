import { html } from 'lit';
import { choose } from 'lit/directives/choose.js';
import { provide } from '@lit/context';
import { msg, localized } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import { type IClone } from '@state/clones-state';
import { type CloneListItemDialog } from './type';
import { OpenCloneListItemDialogEvent } from './events';
import { modalSelectedCloneContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-company-clones-panel')
export class CompanyClonesPanel extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @state()
  private _cloneListItemDialogOpen = false;

  @state()
  private _cloneListItemDialog?: CloneListItemDialog;

  @provide({ context: modalSelectedCloneContext })
  private _modalSelectedClone?: IClone;

  renderMobile() {
    return html`<div class="host-content mobile">${this.renderContent()}</div>`;
  }

  renderDesktop() {
    return html`<div class="host-content desktop">${this.renderContent()}</div>`;
  }

  renderContent = () => {
    return html`
      <p class="hint">
        ${msg(`Clone autoupgrade priority can be changed by dragging it by the name if filter is disabled.
Clones on top have higher priority.
Clone level cannot be above development level.`)}
      </p>

      <div class="top-container">
        <sl-button variant="primary" size="medium" @click=${this.handlePurchaseCloneDialogOpen}>
          ${msg('Purchase clone')}
        </sl-button>

        <ca-clones-synchronization-values></ca-clones-synchronization-values>
      </div>

      <ca-clones-list @open-clone-list-item-dialog=${this.handleCloneListItemDialogOpen}></ca-clones-list>

      ${this._cloneListItemDialog &&
      choose(this._cloneListItemDialog, [
        [
          'rename-clone',
          () => html`
            <ca-rename-clone-dialog
              ?open=${this._cloneListItemDialogOpen}
              @close-clone-list-item-dialog=${this.handleCloneListItemDialogClose}
            ></ca-rename-clone-dialog>
          `,
        ],
        [
          'purchase-clone',
          () => html`
            <ca-purchase-clone-dialog
              ?open=${this._cloneListItemDialogOpen}
              @close-clone-list-item-dialog=${this.handleCloneListItemDialogClose}
            ></ca-purchase-clone-dialog>
          `,
        ],
      ])}
    `;
  };

  private handlePurchaseCloneDialogOpen = () => {
    this._cloneListItemDialogOpen = true;
    this._modalSelectedClone = undefined;
    this._cloneListItemDialog = 'purchase-clone';
  };

  private handleCloneListItemDialogOpen = (event: OpenCloneListItemDialogEvent) => {
    this._cloneListItemDialogOpen = true;
    this._modalSelectedClone = event.clone;
    this._cloneListItemDialog = event.dialog;
  };

  private handleCloneListItemDialogClose = () => {
    this._cloneListItemDialogOpen = false;
    this._modalSelectedClone = undefined;
    this._cloneListItemDialog = undefined;
  };
}
