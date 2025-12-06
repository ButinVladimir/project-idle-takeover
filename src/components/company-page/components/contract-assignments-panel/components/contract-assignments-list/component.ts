import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BaseComponent, ContractAlert, DELETE_VALUES } from '@shared/index';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { IContractAssignment } from '@state/automation-state';
import { ContractAssignmentsListController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-contract-assignments-list')
export class ContractAssignmentsList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ContractAssignmentsListController;

  constructor() {
    super();

    this._controller = new ContractAssignmentsListController(this);
  }

  protected renderDesktop() {
    const removeAllContractAssignments = msg('Remove all contract assignments');

    return html`
      <div class="header desktop">
        <div class="header-column">${msg('Contract')}</div>
        <div class="header-column">${msg('District')}</div>
        <div class="header-column">${msg('Assigned clones')}</div>
        <div class="header-column">${msg('Status')}</div>
        <div class="buttons">
          <sl-tooltip>
            <span slot="content"> ${removeAllContractAssignments} </span>

            <sl-icon-button
              id="delete-btn"
              name=${DELETE_VALUES.icon}
              label=${removeAllContractAssignments}
              @click=${this.handleOpenRemoveAllContractAssignmentsDialog}
            >
            </sl-icon-button>
          </sl-tooltip>
        </div>
      </div>

      ${this.renderContractAssignmentsList()}
    `;
  }

  protected renderMobile() {
    return html`
      <div class="header mobile">
        <div class="buttons">
          <sl-button
            variant=${DELETE_VALUES.buttonVariant}
            size="medium"
            @click=${this.handleOpenRemoveAllContractAssignmentsDialog}
          >
            <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>
            ${msg('Remove all contract assignments')}
          </sl-button>
        </div>
      </div>

      ${this.renderContractAssignmentsList()}
    `;
  }

  private renderContractAssignmentsList = () => {
    const assignments = this._controller.listContractAssignments();

    return assignments.length > 0
      ? html`${repeat(assignments, (contractAssignment) => contractAssignment.id, this.renderContractAssignment)}`
      : this.renderEmptyListNotification();
  };

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg("You don't have any contracts assignments")}</div> `;
  };

  private renderContractAssignment = (contractAssignment: IContractAssignment) => {
    return html`<ca-contract-assignments-list-item
      assignment-id=${contractAssignment.id}
    ></ca-contract-assignments-list-item>`;
  };

  private handleOpenRemoveAllContractAssignmentsDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        ContractAlert.removeAllContractAssignments,
        msg('Are you sure want to remove all contract assignments? All related inactive activities will be cancelled.'),
        this.handleRemoveAllContractAssignments,
      ),
    );
  };

  private handleRemoveAllContractAssignments = () => {
    this._controller.removeAllContractAssignments();
  };
}
