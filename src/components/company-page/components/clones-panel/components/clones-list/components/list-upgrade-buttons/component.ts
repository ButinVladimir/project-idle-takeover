import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { BaseComponent, UPGRADE_MAX_VALUES } from '@shared/index';
import { ClonesListUpgradeButtonsController } from './controller';
import styles from './styles';
import { clonesListContext } from '../../contexts';
import { IClone } from '@state/clones-state';

@localized()
@customElement('ca-clones-list-upgrade-buttons')
export class ClonesListUpgradeButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: ClonesListUpgradeButtonsController;

  private _upgradeLevelMaxButton = createRef<SlButton>();

  @consume({ context: clonesListContext, subscribe: true })
  private _clonesList?: IClone[];

  constructor() {
    super();

    this._controller = new ClonesListUpgradeButtonsController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-button-group>
        <sl-button
          ${ref(this._upgradeLevelMaxButton)}
          disabled
          variant=${UPGRADE_MAX_VALUES.buttonVariant}
          size="medium"
          @click=${this.handleUpgradeMaxDisplayedLevels}
        >
          <sl-icon slot="prefix" name=${UPGRADE_MAX_VALUES.icon}></sl-icon>

          ${msg('Upgrade displayed clones levels')}
        </sl-button>
      </sl-button-group>
    `;
  }

  private handleUpgradeMaxDisplayedLevels = () => {
    const cloneIds = this.getCloneIds();

    this._controller.upgradeMaxDisplayedLevels(cloneIds);
  };

  private getCloneIds(): string[] {
    if (!this._clonesList || this._clonesList.length === 0) {
      return [];
    }

    return this._clonesList.map((clone) => clone.id);
  }

  handlePartialUpdate = () => {
    if (this._upgradeLevelMaxButton.value) {
      const buttonDisabled = !this._clonesList || !this._clonesList.some(this._controller.checkCanUpgradeMaxLevel);

      this._upgradeLevelMaxButton.value.disabled = buttonDisabled;
    }
  };
}
