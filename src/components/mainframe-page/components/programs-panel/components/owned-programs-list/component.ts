import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { provide } from '@lit/context';
import {
  AutoupgradeFilterValue,
  BaseComponent,
  filterByAutoupgrade,
  filterByMaxLevel,
  LevelFilterValue,
} from '@shared/index';
import { IProgram, ProgramName } from '@state/mainframe-state';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { COMMON_TEXTS } from '@texts/index';
import { OwnedProgramsListController } from './controller';
import styles from './styles';
import { ToggleProgramsFilterEvent } from './components/list-buttons/events';
import { programsFilterStateContext, programsListContext } from './contexts';
import { type IProgramsFilterState } from './interfaces';
import { ProgramsFilterStateChangedEvent } from './components/filter/events';

@localized()
@customElement('ca-owned-programs-list')
export class OwnedProgramsList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: OwnedProgramsListController;

  @state()
  private _filterEnabled = false;

  @state()
  @provide({ context: programsFilterStateContext })
  private _programsFilterState: IProgramsFilterState = {
    programs: [],
    tiers: [],
    maxTier: LevelFilterValue.all,
    maxLevel: LevelFilterValue.all,
    autoupgrade: AutoupgradeFilterValue.all,
  };

  @provide({ context: programsListContext })
  private _programsList: IProgram[] = [];

  constructor() {
    super();

    this._controller = new OwnedProgramsListController(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  protected renderDesktop() {
    return html`
      <div class="items-list">
        <ca-owned-programs-list-filter
          ?filter-enabled=${this._filterEnabled}
          @programs-filter-state-changed=${this.handleChangeFilterState}
        ></ca-owned-programs-list-filter>

        <div class="header desktop">
          <div class="header-column">${msg('Program')}</div>
          <div class="header-column">${COMMON_TEXTS.tier()}</div>
          <div class="header-column">${COMMON_TEXTS.level()}</div>
          <ca-owned-programs-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-programs-filter=${this.handleToggleFilter}
          ></ca-owned-programs-list-buttons>
        </div>

        ${this._programsList.length > 0
          ? html`
              <ca-sortable-list
                class="list"
                ?drag-enabled=${!this._filterEnabled}
                @sortable-element-moved=${this.handleMoveProgram}
              >
                ${repeat(this._programsList, (program) => program.name, this.renderProgram)}
              </ca-sortable-list>
            `
          : this.renderEmptyListNotification()}
      </div>
    `;
  }

  protected renderMobile() {
    return html`
      <div class="items-list">
        <ca-owned-programs-list-filter
          ?filter-enabled=${this._filterEnabled}
          @programs-filter-state-changed=${this.handleChangeFilterState}
        ></ca-owned-programs-list-filter>

        <div class="header mobile">
          <ca-owned-programs-list-buttons
            ?filter-enabled=${this._filterEnabled}
            @toggle-programs-filter=${this.handleToggleFilter}
          ></ca-owned-programs-list-buttons>
        </div>

        ${this._programsList.length > 0
          ? html`
              <ca-sortable-list
                class="list"
                ?drag-enabled=${!this._filterEnabled}
                @sortable-element-moved=${this.handleMoveProgram}
              >
                ${repeat(this._programsList, (program) => program.name, this.renderProgram)}
              </ca-sortable-list>
            `
          : this.renderEmptyListNotification()}
      </div>
    `;
  }

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg('Programs are not found')}</div> `;
  };

  private renderProgram = (program: IProgram) => {
    return html`
      <ca-owned-programs-list-item
        class="list-item"
        ?drag-enabled=${!this._filterEnabled}
        program-name=${program.name}
        data-drag-id=${program.name}
      >
      </ca-owned-programs-list-item>
    `;
  };

  private handleMoveProgram = (event: SortableElementMovedEvent) => {
    this._controller.moveProgram(event.keyName as ProgramName, event.position);
  };

  private handleToggleFilter = (event: ToggleProgramsFilterEvent) => {
    this._filterEnabled = event.filterEnabled;
  };

  private handleChangeFilterState = (event: ProgramsFilterStateChangedEvent) => {
    this._programsFilterState = event.state;
  };

  private updateContext(): void {
    let programs = this._controller.listOwnedPrograms();

    if (this._filterEnabled) {
      programs = programs.filter(this.filterProgram);
    }

    this._programsList = programs;
  }

  private filterProgram = (program: IProgram): boolean => {
    if (!this._filterEnabled) {
      return true;
    }

    if (this._programsFilterState.programs.length > 0 && !this._programsFilterState.programs.includes(program.name)) {
      return false;
    }

    if (this._programsFilterState.tiers.length > 0 && !this._programsFilterState.tiers.includes(program.tier)) {
      return false;
    }

    if (
      !filterByMaxLevel(
        program.tier,
        this._controller.getProgramHighestTier(program.name),
        this._programsFilterState.maxTier,
      )
    ) {
      return false;
    }

    if (!filterByMaxLevel(program.level, this._controller.developmentLevel, this._programsFilterState.maxLevel)) {
      return false;
    }

    if (!filterByAutoupgrade(program.autoUpgradeEnabled, this._programsFilterState.autoupgrade)) {
      return false;
    }

    return true;
  };
}
