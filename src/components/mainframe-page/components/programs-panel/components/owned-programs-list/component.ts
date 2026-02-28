import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BaseComponent } from '@shared/index';
import { IProgram, ProgramName } from '@state/mainframe-state';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { COMMON_TEXTS } from '@texts/index';
import { OwnedProgramsListController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-owned-programs-list')
export class OwnedProgramsList extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: OwnedProgramsListController;

  constructor() {
    super();

    this._controller = new OwnedProgramsListController(this);
  }

  protected renderDesktop() {
    const ownedPrograms = this._controller.listOwnedPrograms();

    return html`
      <div class="items-list">
        <div class="header desktop">
          <div class="header-column">${msg('Program')}</div>
          <div class="header-column">${COMMON_TEXTS.tier()}</div>
          <div class="header-column">${COMMON_TEXTS.level()}</div>
          <ca-owned-programs-list-buttons></ca-owned-programs-list-buttons>
        </div>

        ${ownedPrograms.length > 0
          ? html`
              <ca-sortable-list class="list" @sortable-element-moved=${this.handleMoveProgram}>
                ${repeat(ownedPrograms, (program) => program.name, this.renderProgram)}
              </ca-sortable-list>
            `
          : this.renderEmptyListNotification()}
      </div>
    `;
  }

  protected renderMobile() {
    const ownedPrograms = this._controller.listOwnedPrograms();

    return html`
      <div class="items-list">
        <div class="header mobile">
          <ca-owned-programs-list-buttons></ca-owned-programs-list-buttons>
        </div>

        ${ownedPrograms.length > 0
          ? html`
              <ca-sortable-list class="list" @sortable-element-moved=${this.handleMoveProgram}>
                ${repeat(ownedPrograms, (program) => program.name, this.renderProgram)}
              </ca-sortable-list>
            `
          : this.renderEmptyListNotification()}
      </div>
    `;
  }

  private renderEmptyListNotification = () => {
    return html` <div class="notification">${msg("You don't have any owned programs")}</div> `;
  };

  private renderProgram = (program: IProgram) => {
    return html`
      <ca-owned-programs-list-item class="list-item" program-name=${program.name} data-drag-id=${program.name}>
      </ca-owned-programs-list-item>
    `;
  };

  private handleMoveProgram = (event: SortableElementMovedEvent) => {
    this._controller.moveProgram(event.keyName as ProgramName, event.position);
  };
}
