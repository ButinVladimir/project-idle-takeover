import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { AUTOUPGRADE_VALUES, BaseComponent, CloneAlert, DELETE_VALUES, FILTER_VALUES } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { IClone } from '@state/clones-state';
import { ClonesListButtonsController } from './controller';
import styles from './styles';
import { clonesListContext } from '../../contexts';
import { ToggleClonesFilterEvent } from './events';

@localized()
@customElement('ca-clones-list-buttons')
export class ClonesListButtons extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  private _controller: ClonesListButtonsController;

  @consume({ context: clonesListContext, subscribe: true })
  private _clonesList?: IClone[];

  constructor() {
    super();

    this._controller = new ClonesListButtonsController(this);
  }

  protected renderDesktop() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();
    const filterVariant = this.filterEnabled
      ? FILTER_VALUES.buttonVariant.enabled
      : FILTER_VALUES.buttonVariant.disabled;

    const isAutoupgradeActive = this.checkSomeClonesAutoupgradeActive();

    const autoupgradeLabel = isAutoupgradeActive
      ? COMMON_TEXTS.disableAutoupgradeDisplayed()
      : COMMON_TEXTS.enableAutoupgradeDisplayed();
    const autoupgradeIcon = isAutoupgradeActive ? AUTOUPGRADE_VALUES.icon.enabled : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeVariant = isAutoupgradeActive
      ? AUTOUPGRADE_VALUES.buttonVariant.enabled
      : AUTOUPGRADE_VALUES.buttonVariant.disabled;

    return html`
      <sl-button variant=${filterVariant} size="medium" @click=${this.handleToggleFilter}>
        <sl-icon slot="prefix" name=${filterIcon}> </sl-icon>

        ${filterLabel}
      </sl-button>

      <sl-button variant=${autoupgradeVariant} size="medium" @click=${this.handleToggleAutoupgrade}>
        <sl-icon slot="prefix" name=${autoupgradeIcon}></sl-icon>

        ${autoupgradeLabel}
      </sl-button>

      <sl-button
        variant=${DELETE_VALUES.buttonVariant}
        size="medium"
        @click=${this.handleOpenDeleteDisplayedClonesDialog}
      >
        <sl-icon slot="prefix" name=${DELETE_VALUES.icon}></sl-icon>

        ${msg('Delete displayed clones')}
      </sl-button>
    `;
  }

  private checkSomeClonesAutoupgradeActive(): boolean {
    if (!this._clonesList || this._clonesList.length === 0) {
      return false;
    }

    return this._clonesList.some((clone) => clone.autoUpgradeEnabled);
  }

  private handleToggleAutoupgrade = () => {
    if (!this._clonesList) {
      return false;
    }

    const autoUpgradeEnabled = !this.checkSomeClonesAutoupgradeActive();

    this._clonesList.forEach((clone) => {
      clone.autoUpgradeEnabled = autoUpgradeEnabled;
    });
  };

  private handleOpenDeleteDisplayedClonesDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        CloneAlert.deleteDisplayedClones,
        msg(
          'Are you sure want to delete displayed clones? Their progress will be lost and their actions will be cancelled.',
        ),
        this.handleDeleteDisplayedClones,
      ),
    );
  };

  private handleDeleteDisplayedClones = () => {
    if (!this._clonesList) {
      return;
    }

    const ids = this._clonesList.map((clone) => clone.id);
    this._controller.deleteDisplayedClones(ids);
  };

  private handleToggleFilter = () => {
    this.dispatchEvent(new ToggleClonesFilterEvent(!this.filterEnabled));
  };
}
