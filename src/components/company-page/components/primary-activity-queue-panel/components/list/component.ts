import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { provide } from '@lit/context';
import { IPrimaryActivity, PrimaryActivityState } from '@state/activity-state';
import { ActivityStatusFilterValue, BaseComponent, checkIntersection } from '@shared/index';
import { PrimaryActivityQueueListController } from './controller';
import styles from './styles';
import { TogglePrimaryActivityFilterEvent } from './components/list-buttons/events';
import { primaryActivityFilterStateContext, primaryActivityListContext } from './contexts';
import { type IPrimaryActivityFilterState } from './interfaces';
import { PrimaryActivityFilterStateChangedEvent } from './components/filter/events';

@localized()
@customElement('ca-primary-activity-queue-list')
export class PrimaryActivityQueueList extends BaseComponent {
  static styles = styles;

  @state()
  private _filterEnabled = false;

  @state()
  @provide({ context: primaryActivityFilterStateContext })
  private _primaryActivityFilterState: IPrimaryActivityFilterState = {
    cloneIds: [],
    districtIndexes: [],
    status: ActivityStatusFilterValue.all,
  };

  @provide({ context: primaryActivityListContext })
  private _primaryActivityList: IPrimaryActivity[] = [];

  private _controller: PrimaryActivityQueueListController;

  constructor() {
    super();

    this._controller = new PrimaryActivityQueueListController(this);
  }

  protected renderDesktop() {
    return html`
      <ca-primary-activity-list-filter
        ?filter-enabled=${this._filterEnabled}
        @primary-activity-filter-state-changed=${this.handleChangeFilterState}
      ></ca-primary-activity-list-filter>

      <div class="header-row">
        <ca-primary-activity-list-buttons
          ?filter-enabled=${this._filterEnabled}
          @toggle-primary-activity-filter=${this.handleToggleFilter}
        ></ca-primary-activity-list-buttons>
      </div>

      ${this._primaryActivityList.length > 0
        ? html`
            <div class="list">
              ${repeat(this._primaryActivityList, (activity) => activity.activityId, this.renderPrimaryActivity)}
            </div>
          `
        : this.renderEmptyListNotification()}
    `;
  }

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg('Primary activities are not found')}</div> `;
  };

  private renderPrimaryActivity = (activity: IPrimaryActivity) => {
    return html`
      <ca-primary-activity-queue-list-item activity-id=${activity.activityId}></ca-primary-activity-queue-list-item>
    `;
  };

  private handleToggleFilter = (event: TogglePrimaryActivityFilterEvent) => {
    this._filterEnabled = event.filterEnabled;
  };

  private handleChangeFilterState = (event: PrimaryActivityFilterStateChangedEvent) => {
    this._primaryActivityFilterState = event.state;
  };

  protected updateContext(): void {
    let primaryActivities = this._controller.listActivities();

    if (this._filterEnabled) {
      primaryActivities = primaryActivities.filter(this.filterPrimaryActivity);
    }

    this._primaryActivityList = primaryActivities;
  }

  private filterPrimaryActivity = (primaryActivity: IPrimaryActivity): boolean => {
    if (!this._filterEnabled) {
      return true;
    }

    if (
      this._primaryActivityFilterState.cloneIds.length > 0 &&
      !checkIntersection(
        this._primaryActivityFilterState.cloneIds,
        primaryActivity.assignedClones.map((clone) => clone.id),
      )
    ) {
      return false;
    }

    if (
      this._primaryActivityFilterState.districtIndexes.length > 0 &&
      !this._primaryActivityFilterState.districtIndexes.includes(primaryActivity.district.index)
    ) {
      return false;
    }

    if (!this.filterByStatus(primaryActivity)) {
      return false;
    }

    return true;
  };

  private filterByStatus(primaryActivity: IPrimaryActivity): boolean {
    if (this._primaryActivityFilterState.status === ActivityStatusFilterValue.all) {
      return true;
    }

    const isActive = primaryActivity.state === PrimaryActivityState.active;

    if (this._primaryActivityFilterState.status === ActivityStatusFilterValue.active && isActive) {
      return true;
    }

    if (this._primaryActivityFilterState.status === ActivityStatusFilterValue.inactive && !isActive) {
      return true;
    }

    return false;
  }
}
