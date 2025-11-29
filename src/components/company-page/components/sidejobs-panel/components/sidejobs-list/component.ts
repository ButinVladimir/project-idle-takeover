import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BaseComponent, DELETE_VALUES, SidejobAlert } from '@shared/index';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { ISidejobActivity } from '@state/activity-state';
import { SidejobsListController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-sidejobs-list')
export class SidejobsList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: SidejobsListController;

  constructor() {
    super();

    this._controller = new SidejobsListController(this);
  }

  protected renderDesktop() {
    const cancelAllSidejobs = msg('Cancel all sidejobs');

    return html`
      <div class="header desktop">
        <div class="header-column">${msg('Assigned clone')}</div>
        <div class="header-column">${msg('District')}</div>
        <div class="header-column">${msg('Sidejob')}</div>
        <div class="buttons">
          <sl-tooltip>
            <span slot="content"> ${cancelAllSidejobs} </span>

            <sl-icon-button
              id="delete-btn"
              name=${DELETE_VALUES.icon}
              label=${cancelAllSidejobs}
              @click=${this.handleOpenCancelAllSidejobsDialog}
            >
            </sl-icon-button>
          </sl-tooltip>
        </div>
      </div>

      ${this.renderSidejobsList()}
    `;
  }

  protected renderMobile() {
    return html`
      <div class="header mobile">
        <div class="buttons">
          <sl-button
            variant=${DELETE_VALUES.buttonVariant}
            size="medium"
            @click=${this.handleOpenCancelAllSidejobsDialog}
          >
            <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>
            ${msg('Cancel all sidejobs')}
          </sl-button>
        </div>
      </div>

      ${this.renderSidejobsList()}
    `;
  }

  private renderSidejobsList = () => {
    const activities = this._controller.listActivities();

    return activities.length > 0
      ? html`${repeat(activities, (sidejobActivity) => sidejobActivity.id, this.renderSidejob)}`
      : this.renderEmptyListNotification();
  };

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg("You don't have any assigned sidejobs")}</div> `;
  };

  private renderSidejob = (activity: ISidejobActivity) => {
    return html`<ca-sidejobs-list-item activity-id=${activity.id}></ca-sidejobs-list-item>`;
  };

  private handleOpenCancelAllSidejobsDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        SidejobAlert.cancelAllSidejobs,
        msg('Are you sure want to cancel all sidejobs? Their assigned clones will stop performing them.'),
        this.handleCancelAllSidejobs,
      ),
    );
  };

  private handleCancelAllSidejobs = () => {
    this._controller.cancelAllActivities();
  };
}
