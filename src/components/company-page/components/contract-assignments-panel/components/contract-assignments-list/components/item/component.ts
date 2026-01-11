import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { provide } from '@lit/context';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import {
  BaseComponent,
  DELETE_VALUES,
  DESCRIPTION_ICONS,
  ContractAlert,
  ENTITY_ACTIVE_VALUES,
  START_ACTIVITY_ICON,
} from '@shared/index';
import { COMMON_TEXTS, CONTRACT_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { type IContractAssignment } from '@state/automation-state';
import { ContractAssignmentsListItemController } from './controller';
import { contractAssignmentActivityContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-contract-assignments-list-item')
export class ContractAssignmentListItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'assignment-id',
    type: String,
  })
  assignmentId!: string;

  @state()
  _descriptionVisible = false;

  protected hasMobileRender = true;

  private _controller: ContractAssignmentsListItemController;

  @provide({ context: contractAssignmentActivityContext })
  private _contractAssignment?: IContractAssignment;

  constructor() {
    super();

    this._controller = new ContractAssignmentsListItemController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  protected renderDesktop() {
    if (!this._contractAssignment) {
      return nothing;
    }

    const contractTitle = CONTRACT_TEXTS[this._contractAssignment.contract.contractName].title();

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'contract-assignment-description': true,
      visible: this._descriptionVisible,
    });

    const districtName = DISTRICT_NAMES[this._contractAssignment.contract.district.name]();

    const canBeStarted = this._controller.checkCanBeStarted(this._contractAssignment);
    const startLabel = msg('Add assigned contract to the queue');

    const toggleIcon = this._contractAssignment.enabled
      ? ENTITY_ACTIVE_VALUES.icon.active
      : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleLabel = this._contractAssignment.enabled
      ? msg('Disable contract assignment')
      : msg('Enable contract assignment');

    const removeContractAssignmentLabel = msg('Remove contract assignment');

    return html`
      <div class="host-content desktop">
        <div class="contract-assignment">
          <div class="contract-title" draggable="true" @dragstart=${this.handleDragStart}>
            <sl-icon name="grip-vertical"> </sl-icon>

            ${contractTitle}

            <sl-tooltip>
              <span slot="content">${descriptionButtonLabel}</span>

              <sl-icon-button
                name=${descriptionButtonName}
                class="description-button"
                @click=${this.handleToggleDescription}
              >
              </sl-icon-button>
            </sl-tooltip>
          </div>

          <div class=${descriptionClasses}>
            <ca-contracts-assignments-list-item-description></ca-contracts-assignments-list-item-description>
          </div>
        </div>

        <div>${districtName}</div>

        <div class="clones">
          ${repeat(
            this._contractAssignment.contract.assignedClones,
            (clone) => clone.id,
            (clone) => html`<p>${clone.name}</p>`,
          )}
        </div>

        <div><ca-contract-assignments-list-item-status></ca-contract-assignments-list-item-status></div>

        <div class="buttons">
          <sl-tooltip>
            <span slot="content"> ${startLabel} </span>

            <sl-icon-button
              ?disabled=${!canBeStarted}
              name=${START_ACTIVITY_ICON}
              label=${startLabel}
              @click=${this.handleStartContractAssignment}
            >
            </sl-icon-button>
          </sl-tooltip>

          <sl-tooltip>
            <span slot="content"> ${toggleLabel} </span>

            <sl-icon-button name=${toggleIcon} label=${toggleLabel} @click=${this.handleToggleContractAssignment}>
            </sl-icon-button>
          </sl-tooltip>

          <sl-tooltip>
            <span slot="content"> ${removeContractAssignmentLabel} </span>

            <sl-icon-button
              id="delete-btn"
              name=${DELETE_VALUES.icon}
              label=${removeContractAssignmentLabel}
              @click=${this.handleOpenRemoveContractAssignmentDialog}
            >
            </sl-icon-button>
          </sl-tooltip>
        </div>
      </div>
    `;
  }

  protected renderMobile() {
    if (!this._contractAssignment) {
      return nothing;
    }

    const contractTitle = CONTRACT_TEXTS[this._contractAssignment.contract.contractName].title();

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'contract-assignment-description': true,
      visible: this._descriptionVisible,
    });

    const districtName = DISTRICT_NAMES[this._contractAssignment.contract.district.name]();
    const cloneNames = this._contractAssignment.contract.assignedClones.map((clone) => clone.name);

    const districtNameFull = COMMON_TEXTS.parameterRow(msg('District'), districtName);
    const cloneNamesFull = COMMON_TEXTS.parameterRow(msg('Assigned clones'), cloneNames.join(', '));
    const statusFull = COMMON_TEXTS.parameterRow(
      msg('Status'),
      html`<ca-contract-assignments-list-item-status></ca-contract-assignments-list-item-status>`,
    );

    const canBeStarted = this._controller.checkCanBeStarted(this._contractAssignment);
    const startLabel = msg('Add assigned contract to the queue');
    const startVariant = canBeStarted
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;

    const toggleIcon = this._contractAssignment.enabled
      ? ENTITY_ACTIVE_VALUES.icon.active
      : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleLabel = this._contractAssignment.enabled
      ? msg('Disable contract assignment')
      : msg('Enable contract assignment');
    const toggleVariant = this._contractAssignment.enabled
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;

    const removeContractAssignmentLabel = msg('Remove contract assignment');

    return html`
      <div class="host-content mobile">
        <div class="contract-assignment">
          <div class="contract-title" draggable="true" @dragstart=${this.handleDragStart}>
            <sl-icon name="grip-vertical"> </sl-icon>

            ${contractTitle}

            <sl-tooltip>
              <span slot="content">${descriptionButtonLabel}</span>

              <sl-icon-button
                name=${descriptionButtonName}
                class="description-button"
                @click=${this.handleToggleDescription}
              >
              </sl-icon-button>
            </sl-tooltip>
          </div>

          <div class=${descriptionClasses}>
            <ca-contracts-assignments-list-item-description></ca-contracts-assignments-list-item-description>
          </div>
        </div>

        <div>${districtNameFull}</div>

        <div>${cloneNamesFull}</div>

        <div>${statusFull}</div>

        <div class="buttons">
          <sl-button
            ?disabled=${!canBeStarted}
            variant=${startVariant}
            size="medium"
            @click=${this.handleStartContractAssignment}
          >
            <sl-icon slot="prefix" name=${START_ACTIVITY_ICON}></sl-icon>

            ${startLabel}
          </sl-button>

          <sl-button variant=${toggleVariant} size="medium" @click=${this.handleToggleContractAssignment}>
            <sl-icon slot="prefix" name=${toggleIcon}></sl-icon>

            ${toggleLabel}
          </sl-button>

          <sl-button
            variant=${DELETE_VALUES.buttonVariant}
            size="medium"
            @click=${this.handleOpenRemoveContractAssignmentDialog}
          >
            <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>

            ${removeContractAssignmentLabel}
          </sl-button>
        </div>
      </div>
    `;
  }

  private updateContext() {
    if (this.assignmentId) {
      this._contractAssignment = this._controller.getContractAssignmentById(this.assignmentId);
    } else {
      this._contractAssignment = undefined;
    }
  }

  private handleToggleDescription = () => {
    this._descriptionVisible = !this._descriptionVisible;
  };

  private handleOpenRemoveContractAssignmentDialog = () => {
    const contractName = CONTRACT_TEXTS[this._contractAssignment!.contract.contractName].title();
    const districtName = DISTRICT_NAMES[this._contractAssignment!.contract.district.name]();
    const cloneNames = this._contractAssignment!.contract.assignedClones.map((clone) => `"${clone.name}"`).join(', ');

    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        ContractAlert.replaceContractAssignment,
        msg(
          str`Are you sure want to remove contract assignment for contract "${contractName}" in district "${districtName}" assigned to clones ${cloneNames}? It will also be removed from primary activity queue.`,
        ),
        this.handleRemoveContractAssignment,
      ),
    );
  };

  private handleRemoveContractAssignment = () => {
    this._controller.removeContractAssignmentById(this.assignmentId);
  };

  private handleDragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.assignmentId);
    }
  };

  private handleToggleContractAssignment = () => {
    this._controller.toggleContractAssignment();
  };

  private handleStartContractAssignment = () => {
    this._controller.startContractAssignment(this._contractAssignment!.id);
  };
}
