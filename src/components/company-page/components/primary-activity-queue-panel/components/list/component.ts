import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { IPrimaryActivity } from '@state/activity-state';
import { BaseComponent, DELETE_VALUES, PrimaryActivityAlert } from '@shared/index';
import { PrimaryActivityQueueListController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-primary-activity-queue-list')
export class PrimaryActivityQueueList extends BaseComponent {
  static styles = styles;

  private _controller: PrimaryActivityQueueListController;

  constructor() {
    super();

    this._controller = new PrimaryActivityQueueListController(this);
  }

  protected renderDesktop() {
    const activities = this._controller.listActivities();

    return html`
      <div class="header-row">
        <sl-button
          variant=${DELETE_VALUES.buttonVariant}
          size="medium"
          @click=${this.handleOpenCancelAllPrimaryActivitiesDialog}
        >
          <sl-icon slot="prefix" name=${DELETE_VALUES.icon}></sl-icon>

          ${msg('Cancel all primary activities')}
        </sl-button>
      </div>

      ${activities.length > 0
        ? html`
            <div class="list">${repeat(activities, (activity) => activity.activityId, this.renderPrimaryActivity)}</div>
          `
        : this.renderEmptyListNotification()}
    `;
  }

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg("You don't have any primary activities")}</div> `;
  };

  private renderPrimaryActivity = (activity: IPrimaryActivity) => {
    return html`
      <ca-primary-activity-queue-list-item activity-id=${activity.activityId}></ca-primary-activity-queue-list-item>
    `;
  };

  private handleOpenCancelAllPrimaryActivitiesDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        PrimaryActivityAlert.cancelAllPrimaryActivities,
        msg('Are you sure want to cancel all primary activities? Their progress will be lost.'),
        this.handleCancelAllPrimaryActivities,
      ),
    );
  };

  private handleCancelAllPrimaryActivities = () => {
    this._controller.cancelAllActivities();
  };
}
