import { html, nothing } from 'lit';
import { consume } from '@lit/context';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { COMMON_TEXTS } from '@texts/common';
import { type IClone } from '@state/company-state';
import { BaseComponent, TOGGLE_DETAILS_VALUES, UPGRADE_MAX_VALUES } from '@shared/index';
import { ClonesListItemButtonsController } from './controller';
import { cloneContext } from '../item/contexts';
import { ToggleDetailsEvent } from './events';
import styles from './styles';

@localized()
@customElement('ca-clones-list-item-buttons')
export class ClonesListItemButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  @property({
    attribute: 'details-visible',
    type: Boolean,
  })
  detailsVisible!: boolean;

  private _controller: ClonesListItemButtonsController;

  @consume({ context: cloneContext })
  private _clone?: IClone;

  private _upgradeLevelMaxButton = createRef<SlButton>();

  constructor() {
    super();

    this._controller = new ClonesListItemButtonsController(this);
  }

  protected renderDesktop() {
    if (!this._clone) {
      return nothing;
    }

    const toggleDetailsLabel = this.detailsVisible ? COMMON_TEXTS.hideDetails() : COMMON_TEXTS.showDetails();
    const toggleDetailsIcon = this.detailsVisible
      ? TOGGLE_DETAILS_VALUES.icon.enabled
      : TOGGLE_DETAILS_VALUES.icon.disabled;
    const toggleDetailsVariant = this.detailsVisible
      ? TOGGLE_DETAILS_VALUES.buttonVariant.enabled
      : TOGGLE_DETAILS_VALUES.buttonVariant.disabled;

    return html`
      <sl-button variant=${toggleDetailsVariant} size="medium" @click=${this.handleToggleDetails}>
        <sl-icon slot="prefix" name=${toggleDetailsIcon}></sl-icon>

        ${toggleDetailsLabel}
      </sl-button>

      <sl-button-group>
        <sl-button
          ${ref(this._upgradeLevelMaxButton)}
          disabled
          variant=${UPGRADE_MAX_VALUES.buttonVariant}
          outline
          size="medium"
          @click=${this.handleUpgradeLevelMax}
        >
          <sl-icon slot="prefix" name=${UPGRADE_MAX_VALUES.icon}></sl-icon>

          ${msg('Upgrade level')}
        </sl-button>
      </sl-button-group>
    `;
  }

  private handleToggleDetails = () => {
    this.dispatchEvent(new ToggleDetailsEvent());
  };

  private handleUpgradeLevelMax = () => {
    if (!this._clone) {
      return;
    }

    this._controller.upgradeCloneLevel(this._clone);
  };

  handlePartialUpdate = () => {
    if (!this._clone) {
      return;
    }

    const upgradeLevelMaxButtonDisabled = !this._controller.checkCanUpgradeCloneLevel(this._clone);

    if (this._upgradeLevelMaxButton.value) {
      this._upgradeLevelMaxButton.value.disabled = upgradeLevelMaxButtonDisabled;
    }
  };
}
