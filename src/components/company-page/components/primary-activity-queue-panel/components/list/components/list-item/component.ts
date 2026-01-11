import { html, nothing } from 'lit';
import { provide } from '@lit/context';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { COMMON_TEXTS } from '@texts/common';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { IContractActivity, type IPrimaryActivity } from '@state/activity-state';
import { BaseComponent, DELETE_VALUES, PrimaryActivityAlert, TOGGLE_DETAILS_VALUES } from '@shared/index';
import { CONTRACT_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { PrimaryActivityQueueListItemController } from './controller';
import { primaryActivityContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-primary-activity-queue-list-item')
export class PrimaryActivityQueueListItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'activity-id',
    type: String,
  })
  public activityId!: string;

  private _controller: PrimaryActivityQueueListItemController;

  @state()
  private _detailsVisible = false;

  @provide({ context: primaryActivityContext })
  private _activity?: IPrimaryActivity;

  constructor() {
    super();

    this._controller = new PrimaryActivityQueueListItemController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  protected renderDesktop() {
    if (!this._activity) {
      return nothing;
    }

    let activityName: string;
    let activityType: string;
    switch (this._activity.type) {
      case 'contract':
        activityName =
          CONTRACT_TEXTS[(this._activity as IContractActivity).contractAssignment.contract.contractName].title();
        activityType = msg('Contract');
        break;
    }

    const districtName = DISTRICT_NAMES[this._activity.district.name]();
    const cloneNames = this._activity.assignedClones.map((clone) => clone.name).join(', ');

    const cancelActivityLabel = msg('Cancel primary activity');

    const toggleDetailsLabel = this._detailsVisible ? COMMON_TEXTS.hideDetails() : COMMON_TEXTS.showDetails();
    const toggleDetailsIcon = this._detailsVisible
      ? TOGGLE_DETAILS_VALUES.icon.enabled
      : TOGGLE_DETAILS_VALUES.icon.disabled;
    const toggleDetailsVariant = this._detailsVisible
      ? TOGGLE_DETAILS_VALUES.buttonVariant.enabled
      : TOGGLE_DETAILS_VALUES.buttonVariant.disabled;

    return html`
      <sl-card>
        <div slot="header" class="header">
          <h4 class="title name">${msg(str`${activityType} "${activityName}" in district "${districtName}"`)}</h4>

          <p class="description hint">${msg(str`Assigned to ${cloneNames}`)}</p>

          <sl-tooltip>
            <span slot="content">${cancelActivityLabel}</span>

            <sl-icon-button
              class="menu-button"
              label=${cancelActivityLabel}
              name=${DELETE_VALUES.icon}
              @click=${this.handleCancelActivityDialog}
            ></sl-icon-button>
          </sl-tooltip>
        </div>

        <ca-primary-activity-queue-list-item-description
          ?details-visible=${this._detailsVisible}
        ></ca-primary-activity-queue-list-item-description>

        <div slot="footer">
          <sl-button variant=${toggleDetailsVariant} size="medium" @click=${this.handleToggleDetails}>
            <sl-icon slot="prefix" name=${toggleDetailsIcon}></sl-icon>

            ${toggleDetailsLabel}
          </sl-button>
        </div>
      </sl-card>
    `;
  }

  private updateContext() {
    if (this.activityId) {
      this._activity = this._controller.getPrimaryActivityById(this.activityId);
    } else {
      this._activity = undefined;
    }
  }

  private handleCancelActivityDialog = () => {
    if (!this._activity) {
      return;
    }

    let activityName: string;
    let activityType: string;

    switch (this._activity.type) {
      case 'contract':
        activityName =
          CONTRACT_TEXTS[(this._activity as IContractActivity).contractAssignment.contract.contractName].title();
        activityType = msg('contract');
        break;
    }

    const districtName = DISTRICT_NAMES[this._activity.district.name]();
    const cloneNames = this._activity.assignedClones.map((clone) => clone.name).join(', ');

    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        PrimaryActivityAlert.cancelPrimaryActivity,
        msg(
          str`Are you sure want to cancel primary activity for ${activityType} assigment "${activityName}" in district "${districtName}" for clones ${cloneNames}? It's progress will be lost.`,
        ),
        this.handleCancelPrimaryActivity,
      ),
    );
  };

  private handleCancelPrimaryActivity = () => {
    this._controller.cancelPrimaryActivityById(this.activityId);
  };

  private handleToggleDetails = () => {
    this._detailsVisible = !this._detailsVisible;
  };
}
