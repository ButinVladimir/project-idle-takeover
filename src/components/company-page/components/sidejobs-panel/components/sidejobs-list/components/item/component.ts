import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { provide } from '@lit/context';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, SidejobAlert, DELETE_VALUES, DESCRIPTION_ICONS } from '@shared/index';
import { COMMON_TEXTS, DISTRICT_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { type ISidejobActivity } from '@state/activity-state';
import { SidejobsListItemController } from './controller';
import { sidejobActivityContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-sidejobs-list-item')
export class SidejobsListItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'activity-id',
    type: String,
  })
  activityId!: string;

  @state()
  _descriptionVisible = false;

  protected hasMobileRender = true;

  private _controller: SidejobsListItemController;

  @provide({ context: sidejobActivityContext })
  private _activity?: ISidejobActivity;

  constructor() {
    super();

    this._controller = new SidejobsListItemController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  protected renderDesktop() {
    if (!this._activity) {
      return nothing;
    }

    const sidejobTitle = SIDEJOB_TEXTS[this._activity.sidejob.sidejobName].title();

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'sidejob-description': true,
      visible: this._descriptionVisible,
    });

    const districtName = DISTRICT_NAMES[this._activity.sidejob.district.name]();
    const cloneName = this._activity.sidejob.assignedClone.name;

    const cancelSidejobLabel = msg('Cancel sidejob');

    return html`
      <div class="host-content desktop">
        <div>${cloneName}</div>

        <div>${districtName}</div>

        <div class="sidejob">
          <div class="sidejob-title">
            ${sidejobTitle}

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
            <ca-sidejobs-list-item-description></ca-sidejobs-list-item-description>
          </div>
        </div>

        <div class="buttons">
          <sl-tooltip>
            <span slot="content"> ${cancelSidejobLabel} </span>

            <sl-icon-button
              id="delete-btn"
              name=${DELETE_VALUES.icon}
              label=${cancelSidejobLabel}
              @click=${this.handleOpenCancelSidejobDialog}
            >
            </sl-icon-button>
          </sl-tooltip>
        </div>
      </div>
    `;
  }

  protected renderMobile() {
    if (!this._activity) {
      return nothing;
    }

    const sidejobTitle = SIDEJOB_TEXTS[this._activity.sidejob.sidejobName].title();

    const descriptionButtonName = this._descriptionVisible ? DESCRIPTION_ICONS.expanded : DESCRIPTION_ICONS.hidden;
    const descriptionButtonLabel = this._descriptionVisible
      ? COMMON_TEXTS.hideDescription()
      : COMMON_TEXTS.showDescription();
    const descriptionClasses = classMap({
      'sidejob-description': true,
      visible: this._descriptionVisible,
    });

    const districtName = DISTRICT_NAMES[this._activity.sidejob.district.name]();
    const cloneName = this._activity.sidejob.assignedClone.name;

    const districtNameFull = COMMON_TEXTS.parameterValue(msg('District'), districtName);
    const cloneNameFull = COMMON_TEXTS.parameterValue(msg('Assigned clone'), cloneName);

    const cancelSidejobLabel = msg('Cancel sidejob');

    return html`
      <div class="host-content mobile">
        <div>${cloneNameFull}</div>

        <div>${districtNameFull}</div>

        <div class="sidejob">
          <div class="sidejob-title">
            ${sidejobTitle}

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
            <ca-sidejobs-list-item-description></ca-sidejobs-list-item-description>
          </div>
        </div>

        <div class="buttons">
          <sl-button variant=${DELETE_VALUES.buttonVariant} size="medium" @click=${this.handleOpenCancelSidejobDialog}>
            <sl-icon slot="prefix" name=${DELETE_VALUES.icon}> </sl-icon>

            ${cancelSidejobLabel}
          </sl-button>
        </div>
      </div>
    `;
  }

  private updateContext() {
    if (this.activityId) {
      this._activity = this._controller.getActivityById(this.activityId);
    } else {
      this._activity = undefined;
    }
  }

  private handleToggleDescription = () => {
    this._descriptionVisible = !this._descriptionVisible;
  };

  private handleOpenCancelSidejobDialog = () => {
    const sidejobName = SIDEJOB_TEXTS[this._activity!.sidejob.sidejobName].title();
    const districtName = DISTRICT_NAMES[this._activity!.sidejob.district.name]();
    const cloneName = this._activity!.sidejob.assignedClone.name;

    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        SidejobAlert.sidejobCancel,
        msg(
          str`Are you sure want to cancel sidejob "${sidejobName}" in district "${districtName}" assigned to clone "${cloneName}"?`,
        ),
        this.handleCancelSidejob,
      ),
    );
  };

  private handleCancelSidejob = () => {
    this._controller.cancelActivityById(this.activityId);
  };
}
