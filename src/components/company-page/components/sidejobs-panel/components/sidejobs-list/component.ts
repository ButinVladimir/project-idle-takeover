import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { provide } from '@lit/context';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ActivityStatusFilterValue, BaseComponent, filterByState, StateFilterValue } from '@shared/index';
import { ISidejobActivity } from '@state/activity-state';
import { SidejobsListController } from './controller';
import styles from './styles';
import { sidejobsFilterStateContext, sidejobsListContext } from './contexts';
import { type ISidejobsFilterState } from './interfaces';
import { ToggleSidejobsFilterEvent } from './components/list-buttons/events';
import { SidejobsFilterStateChangedEvent } from './components/filter/events';

@localized()
@customElement('ca-sidejobs-list')
export class SidejobsList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @state()
  private _filterEnabled = false;

  @state()
  @provide({ context: sidejobsFilterStateContext })
  private _sidejobsFilterState: ISidejobsFilterState = {
    cloneIds: [],
    districtIndexes: [],
    sidejobNames: [],
    enabled: StateFilterValue.all,
    state: ActivityStatusFilterValue.all,
  };

  @provide({ context: sidejobsListContext })
  private _sidejobsList: ISidejobActivity[] = [];

  private _controller: SidejobsListController;

  constructor() {
    super();

    this._controller = new SidejobsListController(this);
  }

  protected renderDesktop() {
    return html`
      <div class="items-list">
        <ca-sidejobs-list-filter
          ?filter-enabled=${this._filterEnabled}
          @sidejobs-filter-state-changed=${this.handleChangeFilterState}
        ></ca-sidejobs-list-filter>

        <div class="header desktop">
          <div class="header-column">${msg('Sidejob')}</div>
          <div class="header-column">${msg('District')}</div>
          <div class="header-column">${msg('Assigned clone')}</div>
          <div class="header-column">${msg('Status')}</div>
          <ca-sidejobs-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-sidejobs-filter=${this.handleToggleFilter}
          ></ca-sidejobs-list-buttons>
        </div>

        ${this.renderSidejobsList()}
      </div>
    `;
  }

  protected renderMobile() {
    return html`
      <div class="items-list">
        <ca-sidejobs-list-filter
          ?filter-enabled=${this._filterEnabled}
          @sidejobs-filter-state-changed=${this.handleChangeFilterState}
        ></ca-sidejobs-list-filter>

        <div class="header mobile">
          <ca-sidejobs-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-sidejobs-filter=${this.handleToggleFilter}
          ></ca-sidejobs-list-buttons>
        </div>

        ${this.renderSidejobsList()}
      </div>
    `;
  }

  private renderSidejobsList = () => {
    return this._sidejobsList.length > 0
      ? html` <div class="list">
          ${repeat(this._sidejobsList, (sidejobActivity) => sidejobActivity.id, this.renderSidejob)}
        </div>`
      : this.renderEmptyListNotification();
  };

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg('Sidejobs are not found')}</div> `;
  };

  private renderSidejob = (activity: ISidejobActivity) => {
    return html`<ca-sidejobs-list-item class="list-item" activity-id=${activity.id}></ca-sidejobs-list-item>`;
  };

  protected updateContext(): void {
    let sidejobs = this._controller.listActivities();

    if (this._filterEnabled) {
      sidejobs = sidejobs.filter(this.filterSidejob);
    }

    this._sidejobsList = sidejobs;
  }

  private filterSidejob = (sidejobActivity: ISidejobActivity): boolean => {
    if (!this._filterEnabled) {
      return true;
    }

    if (
      this._sidejobsFilterState.cloneIds.length > 0 &&
      !this._sidejobsFilterState.cloneIds.includes(sidejobActivity.sidejob.assignedClone.id)
    ) {
      return false;
    }

    if (
      this._sidejobsFilterState.districtIndexes.length > 0 &&
      !this._sidejobsFilterState.districtIndexes.includes(sidejobActivity.sidejob.district.index)
    ) {
      return false;
    }

    if (
      this._sidejobsFilterState.sidejobNames.length > 0 &&
      !this._sidejobsFilterState.sidejobNames.includes(sidejobActivity.sidejob.sidejobName)
    ) {
      return false;
    }

    if (!this.filterByStatus(sidejobActivity)) {
      return false;
    }

    if (!filterByState(sidejobActivity.enabled, this._sidejobsFilterState.enabled)) {
      return false;
    }

    return true;
  };

  private filterByStatus(sidejobActivity: ISidejobActivity): boolean {
    if (this._sidejobsFilterState.state === ActivityStatusFilterValue.all) {
      return true;
    }

    if (this._sidejobsFilterState.state === ActivityStatusFilterValue.active && sidejobActivity.active) {
      return true;
    }

    if (this._sidejobsFilterState.state === ActivityStatusFilterValue.inactive && !sidejobActivity.active) {
      return true;
    }

    return false;
  }

  private handleToggleFilter = (event: ToggleSidejobsFilterEvent) => {
    this._filterEnabled = event.filterEnabled;
  };

  private handleChangeFilterState = (event: SidejobsFilterStateChangedEvent) => {
    this._sidejobsFilterState = event.state;
  };
}
