import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import {
  BaseComponent,
  FILTER_VALUES,
  ENTITY_ACTIVE_VALUES,
  DELETE_VALUES,
  ContractAlert,
  START_ACTIVITY_ICON,
} from '@shared/index';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { IContractAssignment } from '@state/automation-state';
import { COMMON_TEXTS } from '@texts/common';
import { SidejobsListButtonsController } from './controller';
import styles from './styles';
import { ToggleContractsFilterEvent } from './events';
import { contractsListContext } from '../../contexts';

@localized()
@customElement('ca-contract-assignments-list-buttons')
export class ContractsListButtons extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  private _controller: SidejobsListButtonsController;

  @consume({ context: contractsListContext, subscribe: true })
  private _contractsList?: IContractAssignment[];

  constructor() {
    super();

    this._controller = new SidejobsListButtonsController(this);
  }

  protected renderDesktop() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();

    const removeDisplayedContractAssignments = msg('Remove displayed contract assignments');

    const contractAssignmentsActive = this.checkSomeContractAssignmentsEnabled();
    const toggleContractAssignmentsIcon = contractAssignmentsActive
      ? ENTITY_ACTIVE_VALUES.icon.active
      : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleContractAssignmentsLabel = contractAssignmentsActive
      ? msg('Disable displayed contract assignments')
      : msg('Enable displayed contract assignments');

    const canStartContractAssignments = this.checkCanStartContractAssignments();
    const startLabel = msg('Add displayed assigned contracts to the queue');
    const startHotkey = this._controller.getStartHotkey();

    return html`
      <div class="buttons desktop buttons-4">
        <sl-tooltip>
          <span slot="content"> ${filterLabel} </span>

          <sl-icon-button name=${filterIcon} label=${filterLabel} @click=${this.handleToggleFilter}> </sl-icon-button>
        </sl-tooltip>

            <sl-tooltip>
              <div class="tooltip-content" slot="content">
                <p>${startLabel}</p>
                <p>${COMMON_TEXTS.hotkey(startHotkey)}</p>
              </div>

              <sl-icon-button
                ?disabled=${!canStartContractAssignments}
                name=${START_ACTIVITY_ICON}
                label=${startLabel}
                @click=${this.handleStartDisplayedContractAssignments}
              >
              </sl-icon-button>
            </sl-tooltip>

            <sl-tooltip>
              <span slot="content"> ${toggleContractAssignmentsLabel} </span>

              <sl-icon-button
                name=${toggleContractAssignmentsIcon}
                label=${toggleContractAssignmentsLabel}
                @click=${this.handleToggleDisplayedContractAssignments}
              >
              </sl-icon-button>
            </sl-tooltip>

            <sl-tooltip>
              <span slot="content"> ${removeDisplayedContractAssignments} </span>

              <sl-icon-button
                id="delete-btn"
                name=${DELETE_VALUES.icon}
                label=${removeDisplayedContractAssignments}
                @click=${this.handleOpenRemoveDisplayedContractAssignmentsDialog}
              >
              </sl-icon-button>
            </sl-tooltip>
        </sl-tooltip>
      </div>
    `;
  }

  protected renderMobile() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();
    const filterVariant = this.filterEnabled
      ? FILTER_VALUES.buttonVariant.enabled
      : FILTER_VALUES.buttonVariant.disabled;

    const contractAssignmentsActive = this.checkSomeContractAssignmentsEnabled();
    const toggleContractAssignmentsIcon = contractAssignmentsActive
      ? ENTITY_ACTIVE_VALUES.icon.active
      : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleContractAssignmentsLabel = contractAssignmentsActive
      ? msg('Disable displayed contract assignments')
      : msg('Enable displayed contract assignments');
    const toggleContractAssignmentsVariant = contractAssignmentsActive
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;

    const canStartContractAssignments = this.checkCanStartContractAssignments();
    const startLabel = msg('Add displayed assigned contracts to the queue');
    const startVariant = canStartContractAssignments
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;
    const startHotkey = this._controller.getStartHotkey();

    return html`
      <div class="buttons mobile">
        <sl-button variant=${filterVariant} size="medium" @click=${this.handleToggleFilter}>
          <sl-icon slot="prefix" name=${filterIcon}> </sl-icon>

          ${filterLabel}
        </sl-button>
        <sl-tooltip>
          <span slot="content">${COMMON_TEXTS.hotkey(startHotkey)} </span>

          <sl-button
            ?disabled=${!canStartContractAssignments}
            variant=${startVariant}
            size="medium"
            @click=${this.handleStartDisplayedContractAssignments}
          >
            <sl-icon slot="prefix" name=${START_ACTIVITY_ICON}></sl-icon>

            ${startLabel}
          </sl-button>
        </sl-tooltip>

        <sl-button
          variant=${toggleContractAssignmentsVariant}
          size="medium"
          @click=${this.handleToggleDisplayedContractAssignments}
        >
          <sl-icon slot="prefix" name=${toggleContractAssignmentsIcon}></sl-icon>

          ${toggleContractAssignmentsLabel}
        </sl-button>

        <sl-button
          variant=${DELETE_VALUES.buttonVariant}
          size="medium"
          @click=${this.handleOpenRemoveDisplayedContractAssignmentsDialog}
        >
          <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>
          ${msg('Remove displayed contract assignments')}
        </sl-button>
      </div>
    `;
  }

  private handleStartDisplayedContractAssignments = () => {
    if (!this._contractsList) {
      return;
    }

    const ids = this._contractsList.map((contractAssignment) => contractAssignment.id);

    this._controller.startContractAssignments(ids);
  };

  private handleOpenRemoveDisplayedContractAssignmentsDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        ContractAlert.removeDisplayedContractAssignments,
        msg('Are you sure want to remove displayed contract assignments? All related activities will be cancelled.'),
        this.handleRemoveDisplayedContractAssignments,
      ),
    );
  };

  private handleRemoveDisplayedContractAssignments = () => {
    if (!this._contractsList) {
      return;
    }

    const ids = this._contractsList.map((contractAssignment) => contractAssignment.id);

    this._controller.removeContractAssignments(ids);
  };

  private checkSomeContractAssignmentsEnabled(): boolean {
    if (!this._contractsList || this._contractsList.length === 0) {
      return false;
    }

    return this._contractsList.some((contractAssignment) => contractAssignment.enabled);
  }

  private handleToggleDisplayedContractAssignments = () => {
    if (!this._contractsList) {
      return;
    }

    const contractAssignmentsActive = this.checkSomeContractAssignmentsEnabled();

    this._contractsList.forEach((contractAssignment) => {
      contractAssignment.toggleEnabled(!contractAssignmentsActive);
    });
  };

  private handleToggleFilter = () => {
    this.dispatchEvent(new ToggleContractsFilterEvent(!this.filterEnabled));
  };

  private checkCanStartContractAssignments(): boolean {
    if (!this._contractsList) {
      return false;
    }

    return this._contractsList.some(
      (contractAssignment) =>
        contractAssignment.enabled && this._controller.checkContractAssignment(contractAssignment),
    );
  }
}
