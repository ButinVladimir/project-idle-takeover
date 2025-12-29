import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';
import { type ProgramName, type IProgram } from '@state/mainframe-state';
import { BaseComponent, DESCRIPTION_ICONS } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_TEXTS } from '@texts/index';
import { OwnedProgramsListItemController } from './controller';
import { programContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-owned-programs-list-item')
export class OwnedProgramsListItem extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @property({
    attribute: 'program-name',
    type: String,
  })
  programName!: ProgramName;

  @state()
  _descriptionVisible = false;

  private _controller: OwnedProgramsListItemController;

  @provide({ context: programContext })
  private _program?: IProgram;

  constructor() {
    super();

    this._controller = new OwnedProgramsListItemController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  protected renderDesktop() {
    if (!this._program) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'program-description': true,
      visible: this._descriptionVisible,
    });

    const programTitle = PROGRAM_TEXTS[this.programName].title();
    const formattedLevel = formatter.formatLevel(this._program.level);
    const formattedTier = formatter.formatTier(this._program.tier);

    return html`
      <div class="host-content desktop">
        <div class="program">
          <div class="program-title" draggable="true" @dragstart=${this.handleDragStart}>
            <sl-icon name="grip-vertical"> </sl-icon>

            ${programTitle}

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
            <ca-owned-programs-list-item-description></ca-owned-programs-list-item-description>
          </div>
        </div>

        <div>${formattedTier}</div>

        <div>${formattedLevel}</div>

        <ca-owned-programs-list-item-buttons></ca-owned-programs-list-item-buttons>
      </div>
    `;
  }

  protected renderMobile() {
    if (!this._program) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'program-description': true,
      visible: this._descriptionVisible,
    });

    const programTitle = PROGRAM_TEXTS[this.programName].title();
    const formattedLevel = formatter.formatLevel(this._program.level);
    const formattedTier = formatter.formatTier(this._program.tier);

    return html`
      <div class="host-content mobile">
        <div class="program">
          <div class="program-title" draggable="true" @dragstart=${this.handleDragStart}>
            <sl-icon name="grip-vertical"> </sl-icon>

            ${programTitle}

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
            <ca-owned-programs-list-item-description></ca-owned-programs-list-item-description>
          </div>
        </div>

        <div>${COMMON_TEXTS.parameterRow(COMMON_TEXTS.tier(), formattedTier)}</div>

        <div>${COMMON_TEXTS.parameterRow(COMMON_TEXTS.level(), formattedLevel)}</div>

        <ca-owned-programs-list-item-buttons></ca-owned-programs-list-item-buttons>
      </div>
    `;
  }

  private updateContext() {
    if (this.programName) {
      this._program = this._controller.getProgram(this.programName);
    } else {
      this._program = undefined;
    }
  }

  private handleToggleDescription = () => {
    this._descriptionVisible = !this._descriptionVisible;
  };

  private handleDragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.programName);
    }
  };
}
