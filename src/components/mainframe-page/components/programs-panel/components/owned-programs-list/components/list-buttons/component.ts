import { html } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { BaseComponent, AUTOUPGRADE_VALUES, UPGRADE_MAX_VALUES, FILTER_VALUES } from '@shared/index';
import { COMMON_TEXTS } from '@texts/common';
import { OwnedProgramsListButtonsController } from './controller';
import styles from './styles';
import { ToggleProgramsFilterEvent } from './events';

@localized()
@customElement('ca-owned-programs-list-buttons')
export class OwnedProgramsListButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;
  protected hasMobileRender = true;

  @property({
    attribute: 'filter-enabled',
    type: Boolean,
  })
  public filterEnabled = false;

  private _controller: OwnedProgramsListButtonsController;

  private _upgradeMaxButton = createRef<SlButton>();

  constructor() {
    super();

    this._controller = new OwnedProgramsListButtonsController(this);
  }

  protected renderDesktop() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();

    const isAutoupgradeActive = this.checkSomeProgramsAutoupgradeActive();

    const autoupgradeIcon = isAutoupgradeActive ? AUTOUPGRADE_VALUES.icon.enabled : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeLabel = isAutoupgradeActive
      ? COMMON_TEXTS.disableAutoupgradeAll()
      : COMMON_TEXTS.enableAutoupgradeAll();

    const upgradeAllProgramsLabel = COMMON_TEXTS.upgradeAll();

    const hotkey = this._controller.getHotkey();

    return html`
      <div class="buttons desktop">
        <sl-tooltip>
          <span slot="content"> ${filterLabel} </span>

          <sl-icon-button name=${filterIcon} label=${filterLabel} @click=${this.handleToggleFilter}> </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip>
          <div class="tooltip-content" slot="content">
            <p>${upgradeAllProgramsLabel}</p>
            <p>${COMMON_TEXTS.hotkey(hotkey)}</p>
          </div>

          <sl-icon-button
            ${ref(this._upgradeMaxButton)}
            disabled
            name=${UPGRADE_MAX_VALUES.icon}
            label=${upgradeAllProgramsLabel}
            @click=${this.handleUpgradeMaxAllPrograms}
          >
          </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip>
          <span slot="content"> ${autoupgradeLabel} </span>

          <sl-icon-button name=${autoupgradeIcon} label=${autoupgradeLabel} @click=${this.handleToggleAutoupgrade}>
          </sl-icon-button>
        </sl-tooltip>
      </div>
    `;
  }

  protected renderMobile() {
    const filterIcon = this.filterEnabled ? FILTER_VALUES.icon.enabled : FILTER_VALUES.icon.disabled;
    const filterLabel = this.filterEnabled ? COMMON_TEXTS.disableFilter() : COMMON_TEXTS.enableFilter();
    const filterVariant = this.filterEnabled
      ? FILTER_VALUES.buttonVariant.enabled
      : FILTER_VALUES.buttonVariant.disabled;

    const isAutoupgradeActive = this.checkSomeProgramsAutoupgradeActive();

    const autoupgradeIcon = isAutoupgradeActive ? AUTOUPGRADE_VALUES.icon.enabled : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeLabel = isAutoupgradeActive
      ? COMMON_TEXTS.disableAutoupgradeAll()
      : COMMON_TEXTS.enableAutoupgradeAll();
    const autoupgradeVariant = isAutoupgradeActive
      ? AUTOUPGRADE_VALUES.buttonVariant.enabled
      : AUTOUPGRADE_VALUES.buttonVariant.disabled;

    const upgradeAllProgramsLabel = COMMON_TEXTS.upgradeAll();

    const hotkey = this._controller.getHotkey();

    return html`
      <div class="buttons mobile">
        <sl-button variant=${filterVariant} size="medium" @click=${this.handleToggleFilter}>
          <sl-icon slot="prefix" name=${filterIcon}> </sl-icon>

          ${filterLabel}
        </sl-button>

        <sl-tooltip>
          <span slot="content">${COMMON_TEXTS.hotkey(hotkey)}</span>

          <sl-button
            ${ref(this._upgradeMaxButton)}
            disabled
            variant=${UPGRADE_MAX_VALUES.buttonVariant}
            size="medium"
            @click=${this.handleUpgradeMaxAllPrograms}
          >
            <sl-icon slot="prefix" name=${UPGRADE_MAX_VALUES.icon}> </sl-icon>

            ${upgradeAllProgramsLabel}
          </sl-button>
        </sl-tooltip>

        <sl-button variant=${autoupgradeVariant} size="medium" @click=${this.handleToggleAutoupgrade}>
          <sl-icon slot="prefix" name=${autoupgradeIcon}> </sl-icon>

          ${autoupgradeLabel}
        </sl-button>
      </div>
    `;
  }

  private checkSomeProgramsAutoupgradeActive(): boolean {
    const programs = this._controller.listOwnedPrograms();

    return programs.some((program) => program.autoUpgradeEnabled);
  }

  private handleToggleAutoupgrade = () => {
    const active = this.checkSomeProgramsAutoupgradeActive();

    this._controller.toggleAutoUpgrade(!active);
  };

  private handleUpgradeMaxAllPrograms = () => {
    this._controller.upgradeMaxAllPrograms();
  };

  private handleToggleFilter = () => {
    this.dispatchEvent(new ToggleProgramsFilterEvent(!this.filterEnabled));
  };

  handlePartialUpdate = () => {
    const upgradeMaxButtonDisabled = !this._controller.checkCanUpgradeMax();

    if (this._upgradeMaxButton.value) {
      this._upgradeMaxButton.value.disabled = upgradeMaxButtonDisabled;
    }
  };
}
