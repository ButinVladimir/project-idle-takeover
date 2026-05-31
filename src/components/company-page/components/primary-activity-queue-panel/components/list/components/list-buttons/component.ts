import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, DELETE_VALUES, FILTER_VALUES, PrimaryActivityAlert } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { IPrimaryActivity } from '@state/activity-state';
import { PrimaryActivityListButtonsController } from './controller';
import styles from './styles';
import { primaryActivityListContext } from '../../contexts';
import { TogglePrimaryActivityFilterEvent } from './events';

@localized()
@customElement('ca-primary-activity-list-buttons')
export class PrimaryActivityListButtons extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  private _controller: PrimaryActivityListButtonsController;

  @consume({ context: primaryActivityListContext, subscribe: true })
  private _primaryActivityList?: IPrimaryActivity[];

  constructor() {
    super();

    this._controller = new PrimaryActivityListButtonsController(this);
  }

  protected renderDesktop() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();
    const filterVariant = this.filterEnabled
      ? FILTER_VALUES.buttonVariant.enabled
      : FILTER_VALUES.buttonVariant.disabled;

    return html`
      <sl-button variant=${filterVariant} size="medium" @click=${this.handleToggleFilter}>
        <sl-icon slot="prefix" name=${filterIcon}> </sl-icon>

        ${filterLabel}
      </sl-button>

      <sl-button
        variant=${DELETE_VALUES.buttonVariant}
        size="medium"
        @click=${this.handleOpenCancelAllPrimaryActivitiesDialog}
      >
        <sl-icon slot="prefix" name=${DELETE_VALUES.icon}></sl-icon>

        ${msg('Cancel displayed primary activities')}
      </sl-button>
    `;
  }

  private handleOpenCancelAllPrimaryActivitiesDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        PrimaryActivityAlert.cancelDisplayedPrimaryActivities,
        msg('Are you sure want to cancel displayed primary activities? Their progress will be lost.'),
        this.handleCancelDisplayedPrimaryActivities,
      ),
    );
  };

  private handleCancelDisplayedPrimaryActivities = () => {
    if (!this._primaryActivityList) {
      return;
    }

    const ids = this._primaryActivityList.map((primaryActivity) => primaryActivity.activityId);

    this._controller.cancelActivities(ids);
  };

  private handleToggleFilter = () => {
    this.dispatchEvent(new TogglePrimaryActivityFilterEvent(!this.filterEnabled));
  };
}
