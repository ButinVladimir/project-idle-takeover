import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  ActivityStatusFilterValue,
  BaseComponent,
  checkIntersection,
  filterByState,
  StateFilterValue,
} from '@shared/index';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { IContractAssignment } from '@state/automation-state';
import { ContractAssignmentsListController } from './controller';
import styles from './styles';
import { contractsFilterStateContext, contractsListContext } from './contexts';
import { type IContractsFilterState } from './interfaces';
import { provide } from '@lit/context';
import { ToggleContractsFilterEvent } from './components/list-buttons/events';
import { ContractsFilterStateChangedEvent } from './components/filter/events';

@localized()
@customElement('ca-contract-assignments-list')
export class ContractAssignmentsList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @state()
  private _filterEnabled = false;

  @state()
  @provide({ context: contractsFilterStateContext })
  private _contractsFilterState: IContractsFilterState = {
    cloneIds: [],
    districtIndexes: [],
    contractNames: [],
    enabled: StateFilterValue.all,
    state: ActivityStatusFilterValue.all,
  };

  @provide({ context: contractsListContext })
  private _contractsList: IContractAssignment[] = [];

  private _controller: ContractAssignmentsListController;

  constructor() {
    super();

    this._controller = new ContractAssignmentsListController(this);
  }

  protected renderDesktop() {
    return html`
      <div class="items-list">
        <ca-contact-assigments-list-filter
          ?filter-enabled=${this._filterEnabled}
          @contracts-filter-state-changed=${this.handleChangeFilterState}
        ></ca-contact-assigments-list-filter>

        <div class="header desktop">
          <div class="header-column">${msg('Contract')}</div>
          <div class="header-column">${msg('District')}</div>
          <div class="header-column">${msg('Assigned clones')}</div>
          <div class="header-column">${msg('Status')}</div>

          <ca-contract-assignments-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-contracts-filter=${this.handleToggleFilter}
          ></ca-contract-assignments-list-buttons>
        </div>

        ${this.renderContractAssignmentsList()}
      </div>
    `;
  }

  protected renderMobile() {
    return html`
      <div class="items-list">
        <ca-contact-assigments-list-filter
          ?filter-enabled=${this._filterEnabled}
          @contracts-filter-state-changed=${this.handleChangeFilterState}
        ></ca-contact-assigments-list-filter>

        <div class="header mobile">
          <ca-contract-assignments-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-contracts-filter=${this.handleToggleFilter}
          ></ca-contract-assignments-list-buttons>
        </div>

        ${this.renderContractAssignmentsList()}
      </div>
    `;
  }

  private renderContractAssignmentsList = () => {
    return this._contractsList.length > 0
      ? html`
          <ca-sortable-list
            class="list"
            ?drag-enabled=${!this._filterEnabled}
            @sortable-element-moved=${this.handleMoveContractAssignment}
          >
            ${repeat(this._contractsList, (contractAssignment) => contractAssignment.id, this.renderContractAssignment)}
          </ca-sortable-list>
        `
      : this.renderEmptyListNotification();
  };

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg('Contract assignments are not found')}</div> `;
  };

  private renderContractAssignment = (contractAssignment: IContractAssignment) => {
    return html`<ca-contract-assignments-list-item
      ?drag-enabled=${!this._filterEnabled}
      class="list-item"
      assignment-id=${contractAssignment.id}
      data-drag-id=${contractAssignment.id}
    ></ca-contract-assignments-list-item>`;
  };

  private handleMoveContractAssignment = (event: SortableElementMovedEvent) => {
    this._controller.moveContractAssignment(event.keyName, event.position);
  };

  protected updateContext(): void {
    let contactAssignments = this._controller.listContractAssignments();

    if (this._filterEnabled) {
      contactAssignments = contactAssignments.filter(this.filterContractAssignment);
    }

    this._contractsList = contactAssignments;
  }

  private filterContractAssignment = (contractAssignment: IContractAssignment): boolean => {
    if (!this._filterEnabled) {
      return true;
    }

    if (
      this._contractsFilterState.cloneIds.length > 0 &&
      !checkIntersection(
        this._contractsFilterState.cloneIds,
        contractAssignment.contract.assignedClones.map((clone) => clone.id),
      )
    ) {
      return false;
    }

    if (
      this._contractsFilterState.districtIndexes.length > 0 &&
      !this._contractsFilterState.districtIndexes.includes(contractAssignment.contract.district.index)
    ) {
      return false;
    }

    if (
      this._contractsFilterState.contractNames.length > 0 &&
      !this._contractsFilterState.contractNames.includes(contractAssignment.contract.contractName)
    ) {
      return false;
    }

    if (!this.filterByStatus(contractAssignment)) {
      return false;
    }

    if (!filterByState(contractAssignment.enabled, this._contractsFilterState.enabled)) {
      return false;
    }

    return true;
  };

  private filterByStatus(contractAssignment: IContractAssignment): boolean {
    if (this._contractsFilterState.state === ActivityStatusFilterValue.all) {
      return true;
    }

    const queuedContractActivity = this._controller.getContractActivity(contractAssignment);

    if (this._contractsFilterState.state === ActivityStatusFilterValue.active && queuedContractActivity) {
      return true;
    }

    if (this._contractsFilterState.state === ActivityStatusFilterValue.inactive && !queuedContractActivity) {
      return true;
    }

    return false;
  }

  private handleToggleFilter = (event: ToggleContractsFilterEvent) => {
    this._filterEnabled = event.filterEnabled;
  };

  private handleChangeFilterState = (event: ContractsFilterStateChangedEvent) => {
    this._contractsFilterState = event.state;
  };
}
