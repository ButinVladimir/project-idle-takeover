import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import styles from './styles';
import { CompanyContractsPanelController } from './controller';

@localized()
@customElement('ca-company-contract-assignments-panel')
export class CompanyContractsPanel extends BaseComponent {
  static styles = styles;

  @state()
  private _assignClonesDialogOpened = false;

  private _controller: CompanyContractsPanelController;

  constructor() {
    super();

    this._controller = new CompanyContractsPanelController(this);
  }

  protected renderDesktop() {
    return html`
      <p class="hint">
        ${msg(`Contracts provide income every time they're completed.
Contract restart priority can be changed by dragging it by the title.
Contracts on top have higher priority.
Only one team of clones can be assigned per contract type and district.
Contracts won't be re-added to the primary activity queue after they're exhausted automatically, it had to be done by program or manually.`)}
      </p>

      <div class="top-container">
        <sl-tooltip trigger="click">
          <div class="hotkeys-content" slot="content">
            <p>
              ${COMMON_TEXTS.parameterRow(
                msg('Add all enabled assigned contracts to the queue'),
                COMMON_TEXTS.hotkeyValue(this._controller.getAddContractAssignmentsHotkey()),
              )}
            </p>
          </div>

          <sl-button variant="default" size="medium"> ${COMMON_TEXTS.showHotkeys()} </sl-button>
        </sl-tooltip>

        <sl-button
          class="assign-clone"
          variant="primary"
          size="medium"
          @click=${this.handleAssignClonesContractDialogOpen}
        >
          ${msg('Assign clones to contracts')}
        </sl-button>
      </div>

      <ca-contract-assignments-list></ca-contract-assignments-list>

      <ca-assign-clones-contract-dialog
        ?open=${this._assignClonesDialogOpened}
        @assign-clones-contract-dialog-close=${this.handleAssignClonesContractDialogClose}
      >
      </ca-assign-clones-contract-dialog>
    `;
  }

  private handleAssignClonesContractDialogOpen = () => {
    this._assignClonesDialogOpened = true;
  };

  private handleAssignClonesContractDialogClose = () => {
    this._assignClonesDialogOpened = false;
  };
}
