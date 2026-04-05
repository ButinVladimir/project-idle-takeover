import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { BaseComponent, LevelFilterValue, StatusFilterValue, filterByMaxLevel, filterByEnabled } from '@shared/index';
import { IClone } from '@state/clones-state';
import { ClonesListController } from './controller';
import { CLONE_LIST_ITEMS_GAP } from './constants';
import styles from './styles';
import { clonesFilterStateContext, clonesListContext } from './contexts';
import { type IClonesFilterState } from './interfaces';
import { provide } from '@lit/context';
import { ToggleClonesFilterEvent } from './components/list-buttons/events';
import { ClonesFilterStateChangedEvent } from './components/filter/events';

@localized()
@customElement('ca-clones-list')
export class ClonesList extends BaseComponent {
  static styles = styles;

  @state()
  private _filterEnabled = false;

  @state()
  @provide({ context: clonesFilterStateContext })
  private _clonesFilterState: IClonesFilterState = {
    clones: [],
    cloneTemplates: [],
    tiers: [],
    maxLevel: LevelFilterValue.all,
    maxTier: LevelFilterValue.all,
    autoupgrade: StatusFilterValue.all,
  };

  @provide({ context: clonesListContext })
  private _clonesList: IClone[] = [];

  private _controller: ClonesListController;

  constructor() {
    super();

    this._controller = new ClonesListController(this);
  }

  protected renderDesktop() {
    return html`
      <ca-clones-list-filter
        ?filter-enabled=${this._filterEnabled}
        @clones-filter-state-changed=${this.handleChangeFilterState}
      ></ca-clones-list-filter>
      <div class="buttons-row with-border">
        <ca-clones-list-upgrade-buttons></ca-clones-list-upgrade-buttons>
      </div>

      <div class="buttons-row">
        <ca-clones-list-buttons
          ?filter-enabled=${this._filterEnabled}
          @toggle-clones-filter=${this.handleToggleFilter}
        ></ca-clones-list-buttons>
      </div>

      ${this._clonesList.length > 0
        ? html`
            <ca-sortable-list
              ?drag-enabled=${!this._filterEnabled}
              gap=${CLONE_LIST_ITEMS_GAP}
              @sortable-element-moved=${this.handleMoveClone}
            >
              ${repeat(this._clonesList, (clone) => clone.id, this.renderClone)}
            </ca-sortable-list>
          `
        : this.renderEmptyListNotification()}
    `;
  }

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg('Clones are not found')}</div> `;
  };

  private renderClone = (clone: IClone) => {
    return html`<ca-clones-list-item
      clone-id=${clone.id}
      ?drag-enabled=${!this._filterEnabled}
      data-drag-id=${clone.id}
    ></ca-clones-list-item>`;
  };

  private handleToggleFilter = (event: ToggleClonesFilterEvent) => {
    this._filterEnabled = event.filterEnabled;
  };

  private handleChangeFilterState = (event: ClonesFilterStateChangedEvent) => {
    this._clonesFilterState = event.state;
  };

  protected updateContext(): void {
    let clones = this._controller.listClones();

    if (this._filterEnabled) {
      clones = clones.filter(this.filterClone);
    }

    this._clonesList = clones;
  }

  private filterClone = (clone: IClone): boolean => {
    if (!this._filterEnabled) {
      return true;
    }

    if (this._clonesFilterState.clones.length > 0 && !this._clonesFilterState.clones.includes(clone.name)) {
      return false;
    }

    if (
      this._clonesFilterState.cloneTemplates.length > 0 &&
      !this._clonesFilterState.cloneTemplates.includes(clone.templateName)
    ) {
      return false;
    }

    if (this._clonesFilterState.tiers.length > 0 && !this._clonesFilterState.tiers.includes(clone.tier)) {
      return false;
    }

    if (
      !filterByMaxLevel(
        clone.tier,
        this._controller.getCloneTempateHighestTier(clone.templateName),
        this._clonesFilterState.maxTier,
      )
    ) {
      return false;
    }

    if (!filterByMaxLevel(clone.level, this._controller.developmentLevel, this._clonesFilterState.maxLevel)) {
      return false;
    }

    if (!filterByEnabled(clone.autoUpgradeEnabled, this._clonesFilterState.autoupgrade)) {
      return false;
    }

    return true;
  };

  private handleMoveClone = (event: SortableElementMovedEvent) => {
    this._controller.moveClone(event.keyName, event.position);
  };
}
