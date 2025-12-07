import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, DELETE_VALUES, DESCRIPTION_ICONS, ENTITY_ACTIVE_VALUES, ProgramAlert } from '@shared/index';
import { type ProgramName, type IProcess } from '@state/mainframe-state';
import { COMMON_TEXTS, PROGRAM_TEXTS } from '@texts/index';
import { ProcessesListItemController } from './controller';
import { processContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-processes-list-item')
export class ProcessesListItem extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  @property({
    attribute: 'program-name',
    type: String,
  })
  programName!: ProgramName;

  @state()
  _descriptionVisible = false;

  private _controller: ProcessesListItemController;

  @provide({ context: processContext })
  private _process?: IProcess;

  constructor() {
    super();

    this._controller = new ProcessesListItemController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  protected renderDesktop() {
    if (!this._process) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const programTitle = PROGRAM_TEXTS[this.programName].title();

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'program-description': true,
      visible: this._descriptionVisible,
    });

    const formattedUsedCores = formatter.formatNumberDecimal(this._process.usedCores);
    const formattedMaxCores = formatter.formatNumberDecimal(this._process.maxCores);
    const cores = this._process.program.isAutoscalable
      ? msg('Autoscalable')
      : `${formattedUsedCores} / ${formattedMaxCores}`;

    const toggleIcon = this._process.isActive ? ENTITY_ACTIVE_VALUES.icon.active : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleLabel = this._process.isActive ? msg('Disable process') : msg('Enable process');

    const deleteProcessLabel = msg('Delete process');

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
            <ca-processes-list-item-description></ca-processes-list-item-description>
          </div>
        </div>

        <div class="cores">${cores}</div>

        <div class="progress-bar">
          <ca-processes-list-item-progress> </ca-processes-list-item-progress>
        </div>

        <div class="buttons">
          <sl-tooltip>
            <span slot="content"> ${toggleLabel} </span>

            <sl-icon-button name=${toggleIcon} label=${toggleLabel} @click=${this.handleToggleProcess}>
            </sl-icon-button>
          </sl-tooltip>

          <sl-tooltip>
            <span slot="content"> ${deleteProcessLabel} </span>

            <sl-icon-button
              id="delete-btn"
              name=${DELETE_VALUES.icon}
              label=${deleteProcessLabel}
              @click=${this.handleOpenDeleteProcessDialog}
            >
            </sl-icon-button>
          </sl-tooltip>
        </div>
      </div>
    `;
  }

  protected renderMobile() {
    if (!this._process) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const programTitle = PROGRAM_TEXTS[this.programName].title();

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'program-description': true,
      visible: this._descriptionVisible,
    });

    const formattedUsedCores = formatter.formatNumberDecimal(this._process.usedCores);
    const formattedMaxCores = formatter.formatNumberDecimal(this._process.maxCores);
    const coresFull = this._process.program.isAutoscalable
      ? msg('Autoscalable')
      : COMMON_TEXTS.parameterRow(msg('Uses cores'), `${formattedUsedCores} / ${formattedMaxCores}`);

    const toggleIcon = this._process.isActive ? ENTITY_ACTIVE_VALUES.icon.active : ENTITY_ACTIVE_VALUES.icon.stopped;
    const toggleLabel = this._process.isActive ? msg('Disable process') : msg('Enable process');
    const toggleVariant = this._process.isActive
      ? ENTITY_ACTIVE_VALUES.buttonVariant.active
      : ENTITY_ACTIVE_VALUES.buttonVariant.stopped;

    const deleteProcessLabel = msg('Delete process');

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
            <ca-processes-list-item-description></ca-processes-list-item-description>
          </div>
        </div>

        <div class="cores">${coresFull}</div>

        <div class="progress-bar">
          <ca-processes-list-item-progress> </ca-processes-list-item-progress>
        </div>

        <div class="buttons">
          <sl-button variant=${toggleVariant} size="medium" @click=${this.handleToggleProcess}>
            <sl-icon slot="prefix" name=${toggleIcon}></sl-icon>

            ${toggleLabel}
          </sl-button>

          <sl-button variant=${DELETE_VALUES.buttonVariant} size="medium" @click=${this.handleOpenDeleteProcessDialog}>
            <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>

            ${deleteProcessLabel}
          </sl-button>
        </div>
      </div>
    `;
  }

  private updateContext() {
    if (this.programName) {
      this._process = this._controller.getProcess(this.programName);
    } else {
      this._process = undefined;
    }
  }

  private handleToggleDescription = () => {
    this._descriptionVisible = !this._descriptionVisible;
  };

  private handleToggleProcess = () => {
    this._controller.toggleProcess();
  };

  private handleOpenDeleteProcessDialog = () => {
    const programTitle = PROGRAM_TEXTS[this.programName].title();

    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        ProgramAlert.processDelete,
        msg(str`Are you sure want to delete process for program "${programTitle}"? It's progress will be lost.`),
        this.handleDeleteProcess,
      ),
    );
  };

  private handleDeleteProcess = () => {
    this._controller.deleteProcessByName(this.programName);
  };

  private handleDragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.programName);
    }
  };
}
