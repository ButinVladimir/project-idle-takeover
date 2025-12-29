import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { ref, createRef } from 'lit/directives/ref.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { type IProgram } from '@state/mainframe-state/states';
import { BaseComponent, AUTOUPGRADE_VALUES, UPGRADE_MAX_VALUES } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { OwnedProgramsListItemButtonsController } from './controller';
import { programContext } from '../item/contexts';
import styles from './styles';

@localized()
@customElement('ca-owned-programs-list-item-buttons')
export class OwnedProgramsListItemButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;
  protected hasMobileRender = true;

  private _controller: OwnedProgramsListItemButtonsController;

  @consume({ context: programContext, subscribe: true })
  private _program?: IProgram;

  private _upgradeMaxButton = createRef<SlButton>();
  private _upgradeLevelRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new OwnedProgramsListItemButtonsController(this);
  }

  protected renderDesktop() {
    if (!this._program) {
      return nothing;
    }

    const autoupgradeIcon = this._program.autoUpgradeEnabled
      ? AUTOUPGRADE_VALUES.icon.enabled
      : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeLabel = this._program.autoUpgradeEnabled
      ? COMMON_TEXTS.disableAutoupgrade()
      : COMMON_TEXTS.enableAutoupgrade();
    const levelEl = html`<span ${ref(this._upgradeLevelRef)}></span>`;

    return html`
      <div class="buttons desktop">
        <sl-tooltip>
          <span slot="content"> ${COMMON_TEXTS.upgradeToLevel(levelEl)} </span>

          <sl-icon-button
            ${ref(this._upgradeMaxButton)}
            disabled
            name=${UPGRADE_MAX_VALUES.icon}
            label=${COMMON_TEXTS.upgrade()}
            @click=${this.handleUpgradeMax}
          >
          </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip>
          <span slot="content"> ${autoupgradeLabel} </span>

          <sl-icon-button name=${autoupgradeIcon} label=${autoupgradeLabel} @click=${this.handleToggleAutoUpgrade}>
          </sl-icon-button>
        </sl-tooltip>
      </div>
    `;
  }

  protected renderMobile() {
    if (!this._program) {
      return nothing;
    }

    const autoupgradeIcon = this._program.autoUpgradeEnabled
      ? AUTOUPGRADE_VALUES.icon.enabled
      : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeLabel = this._program.autoUpgradeEnabled
      ? COMMON_TEXTS.disableAutoupgrade()
      : COMMON_TEXTS.enableAutoupgrade();
    const autoupgradeVariant = this._program.autoUpgradeEnabled
      ? AUTOUPGRADE_VALUES.buttonVariant.enabled
      : AUTOUPGRADE_VALUES.buttonVariant.disabled;
    const levelEl = html`<span ${ref(this._upgradeLevelRef)}></span>`;

    return html`
      <div class="buttons mobile">
        <sl-button
          ${ref(this._upgradeMaxButton)}
          disabled
          variant=${UPGRADE_MAX_VALUES.buttonVariant}
          size="medium"
          @click=${this.handleUpgradeMax}
        >
          <sl-icon slot="prefix" name=${UPGRADE_MAX_VALUES.icon}> </sl-icon>

          ${COMMON_TEXTS.upgradeToLevel(levelEl)}
        </sl-button>

        <sl-button variant=${autoupgradeVariant} size="medium" @click=${this.handleToggleAutoUpgrade}>
          <sl-icon slot="prefix" name=${autoupgradeIcon}> </sl-icon>

          ${autoupgradeLabel}
        </sl-button>
      </div>
    `;
  }

  private handleToggleAutoUpgrade = () => {
    if (this._program) {
      this._program.autoUpgradeEnabled = !this._program.autoUpgradeEnabled;
    }
  };

  private handleUpgradeMax = () => {
    if (this._program) {
      this._controller.upgradeMaxProgram(this._program);
    }
  };

  private updateUpgradeMaxButton() {
    if (!this._upgradeMaxButton.value) {
      return;
    }

    const upgradeMaxButtonDisabled = !this._controller.checkCanUpgradeMax(this._program!);
    this._upgradeMaxButton.value.disabled = upgradeMaxButtonDisabled;
  }

  private updateUpgradeLevel(): void {
    if (!this._upgradeLevelRef.value) {
      return;
    }

    const level = Math.max(this._controller.calculateUpgradeLevel(this._program!), this._program!.level + 1);
    const formattedLevel = this._controller.formatter.formatLevel(level);

    this._upgradeLevelRef.value.textContent = formattedLevel;
  }

  handlePartialUpdate = () => {
    if (!this._program) {
      return;
    }

    this.updateUpgradeLevel();
    this.updateUpgradeMaxButton();
  };
}
