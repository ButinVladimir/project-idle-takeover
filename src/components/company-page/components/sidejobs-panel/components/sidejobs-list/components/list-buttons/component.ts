import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { ISidejobActivity } from '@state/activity-state';
import { BaseComponent, FILTER_VALUES, ENTITY_ACTIVE_VALUES, DELETE_VALUES, SidejobAlert } from '@shared/index';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { COMMON_TEXTS } from '@texts/common';
import { SidejobsListButtonsController } from './controller';
import styles from './styles';
import { ToggleSidejobsFilterEvent } from './events';
import { sidejobsListContext } from '../../contexts';

@localized()
@customElement('ca-sidejobs-list-buttons')
export class SidejobsListButtons extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  private _controller: SidejobsListButtonsController;

  @consume({ context: sidejobsListContext, subscribe: true })
  private _sidejobsList?: ISidejobActivity[];

  constructor() {
    super();

    this._controller = new SidejobsListButtonsController(this);
  }

  protected renderDesktop() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();

    const activitiesEnabled = this.checkSomeActivitiesEnabled();
    const toggleActivitiesIcon = activitiesEnabled
      ? ENTITY_ACTIVE_VALUES.icon.active
      : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleActivitiesLabel = activitiesEnabled
      ? msg('Disable displayed sidejobs')
      : msg('Enable displayed sidejobs');

    const cancelAllSidejobs = msg('Cancel displayed sidejobs');

    return html`
      <div class="buttons desktop buttons-3">
        <sl-tooltip>
          <span slot="content"> ${filterLabel} </span>

          <sl-icon-button name=${filterIcon} label=${filterLabel} @click=${this.handleToggleFilter}> </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip>
          <span slot="content"> ${toggleActivitiesLabel} </span>

          <sl-icon-button
            name=${toggleActivitiesIcon}
            label=${toggleActivitiesLabel}
            @click=${this.handleToggleDisplayedActivities}
          >
          </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip>
          <span slot="content"> ${cancelAllSidejobs} </span>

          <sl-icon-button
            id="delete-btn"
            name=${DELETE_VALUES.icon}
            label=${cancelAllSidejobs}
            @click=${this.handleOpenCancelDisplayedSidejobsDialog}
          >
          </sl-icon-button>
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

    const activitiesEnabled = this.checkSomeActivitiesEnabled();
    const toggleActivitiesIcon = activitiesEnabled
      ? ENTITY_ACTIVE_VALUES.icon.active
      : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleActivitiesLabel = activitiesEnabled
      ? msg('Disable displayed sidejobs')
      : msg('Enable displayed sidejobs');
    const toggleActivitiesVariant = activitiesEnabled
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;

    return html`
      <div class="buttons mobile">
        <sl-button variant=${filterVariant} size="medium" @click=${this.handleToggleFilter}>
          <sl-icon slot="prefix" name=${filterIcon}> </sl-icon>

          ${filterLabel}
        </sl-button>

        <sl-button variant=${toggleActivitiesVariant} size="medium" @click=${this.handleToggleDisplayedActivities}>
          <sl-icon slot="prefix" name=${toggleActivitiesIcon}></sl-icon>

          ${toggleActivitiesLabel}
        </sl-button>

        <sl-button
          variant=${DELETE_VALUES.buttonVariant}
          size="medium"
          @click=${this.handleOpenCancelDisplayedSidejobsDialog}
        >
          <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>
          ${msg('Cancel displayed sidejobs')}
        </sl-button>
      </div>
    `;
  }

  private handleOpenCancelDisplayedSidejobsDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        SidejobAlert.cancelDisplayedSidejobs,
        msg('Are you sure want to cancel displayed sidejobs? Their assigned clones will stop performing them.'),
        this.handleCancelDisplayedSidejobs,
      ),
    );
  };

  private handleCancelDisplayedSidejobs = () => {
    if (!this._sidejobsList) {
      return;
    }

    const sidejobIds = this._sidejobsList.map((sidejobActivity) => sidejobActivity.id);

    this._controller.cancelActivities(sidejobIds);
  };

  private checkSomeActivitiesEnabled(): boolean {
    if (!this._sidejobsList || this._sidejobsList.length === 0) {
      return false;
    }

    return this._sidejobsList.some((activity) => activity.enabled);
  }

  private handleToggleDisplayedActivities = () => {
    if (!this._sidejobsList) {
      return;
    }

    const sidejobsEnabled = this.checkSomeActivitiesEnabled();

    this._sidejobsList.forEach((sidejobActivity) => {
      sidejobActivity.toggleEnabled(!sidejobsEnabled);
    });
  };

  private handleToggleFilter = () => {
    this.dispatchEvent(new ToggleSidejobsFilterEvent(!this.filterEnabled));
  };
}
