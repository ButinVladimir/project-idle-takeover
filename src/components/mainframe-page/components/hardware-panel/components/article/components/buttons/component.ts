import { html, nothing } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import { type IMainframeHardwareParameter } from '@state/mainframe-state';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { MainframeHardwarePanelArticleButtonsController } from './controller';
import { BuyHardwareEvent, BuyMaxHardwareEvent } from './events';
import { MainframeHardwarePanelArticleWarning } from './types';
import { mainframeHardwareParameterContext } from '../../contexts';
import styles from './styles';

@customElement('ca-mainframe-hardware-panel-article-buttons')
export class MainframeHardwarePanelArticleButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;
  protected hasMobileRender = true;

  @property({
    attribute: 'increase',
    type: Number,
  })
  increase!: number;

  @property({
    attribute: 'disabled',
    type: Boolean,
  })
  disabled = false;

  @property({
    attribute: 'disabled-buy-all',
    type: Boolean,
  })
  disabledBuyAll = false;

  private _controller: MainframeHardwarePanelArticleButtonsController;

  @queryAll('p[data-warning]')
  private _warningElements!: NodeListOf<HTMLParagraphElement>;

  private _buyButtonRef = createRef<SlButton>();
  private _buyMaxButtonRef = createRef<SlButton>();
  private _availableTimeRef = createRef<HTMLSpanElement>();
  private _upgradeLevelRef = createRef<HTMLSpanElement>();

  @consume({ context: mainframeHardwareParameterContext, subscribe: true })
  private _parameter?: IMainframeHardwareParameter;

  constructor() {
    super();

    this._controller = new MainframeHardwarePanelArticleButtonsController(this);
  }

  protected renderDesktop() {
    return html`<div class="host-content desktop">${this.renderContent()}</div>`;
  }

  protected renderMobile() {
    return html`<div class="host-content mobile">${this.renderContent()}</div>`;
  }

  private renderContent = () => {
    if (!this._parameter) {
      return nothing;
    }

    const formattedIncrease = this._controller.formatter.formatNumberDecimal(this.increase);
    const hotkey = this._controller.getHotkey(this._parameter.type);
    const levelEl = html`<span ${ref(this._upgradeLevelRef)}></span>`;

    return html`
      <div class="buttons">
        <sl-tooltip>
          <span slot="content">${COMMON_TEXTS.hotkey(hotkey)}</span>

          <sl-button
            ${ref(this._buyMaxButtonRef)}
            ?disabled=${this.disabledBuyAll}
            variant="default"
            type="button"
            size="medium"
            @click=${this.handleBuyMax}
          >
            ${COMMON_TEXTS.upgradeToLevel(levelEl)}
          </sl-button>
        </sl-tooltip>

        <sl-button
          ${ref(this._buyButtonRef)}
          ?disabled=${this.disabled}
          variant="primary"
          type="button"
          size="medium"
          @click=${this.handlePurchase}
        >
          ${COMMON_TEXTS.upgradeIncrease(formattedIncrease)}
        </sl-button>
      </div>

      ${this.renderWarnings()}
    `;
  };

  private renderWarnings = () => {
    return html`
      <p class="warning" data-warning=${MainframeHardwarePanelArticleWarning.higherDevelopmentLevelRequired}>
        ${COMMON_TEXTS.higherDevelopmentLevelRequired()}
      </p>
      <p class="warning" data-warning=${MainframeHardwarePanelArticleWarning.notEnoughMoney}>
        ${COMMON_TEXTS.notEnoughMoney()}
      </p>
      <p class="warning" data-warning=${MainframeHardwarePanelArticleWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
    `;
  };

  private selectWarning(): MainframeHardwarePanelArticleWarning | undefined {
    if (this._parameter!.level + this.increase > this._controller.developmentLevel) {
      return MainframeHardwarePanelArticleWarning.higherDevelopmentLevelRequired;
    }

    const cost = this._parameter!.calculateIncreaseCost(this.increase);
    const moneyGrowth = this._controller.moneyGrowth;
    const moneyDiff = cost - this._controller.money;

    if (moneyDiff > 0) {
      if (moneyGrowth <= 0) {
        return MainframeHardwarePanelArticleWarning.notEnoughMoney;
      }

      return MainframeHardwarePanelArticleWarning.willBeAvailableIn;
    }

    return undefined;
  }

  private updateAvailabilityTimer(): void {
    if (!this._availableTimeRef.value) {
      return;
    }

    const cost = this._parameter!.calculateIncreaseCost(this.increase);
    const moneyGrowth = this._controller.moneyGrowth;
    const moneyDiff = cost - this._controller.money;

    if (moneyDiff < 0 || moneyGrowth < 0) {
      this._availableTimeRef.value.textContent = '';
    } else {
      const formattedTime = this._controller.formatter.formatTimeLong(moneyDiff / moneyGrowth);
      this._availableTimeRef.value.textContent = formattedTime;
    }
  }

  private updateUpgradeLevel(): void {
    if (!this._upgradeLevelRef.value) {
      return;
    }

    const increase = Math.max(this._parameter!.calculateIncreaseFromMoney(this._controller.money), 1);
    const level = this._parameter!.level + increase;

    const formattedLevel = this._controller.formatter.formatLevel(level);

    this._upgradeLevelRef.value.textContent = formattedLevel;
  }

  private handlePurchase = () => {
    this.dispatchEvent(new BuyHardwareEvent());
  };

  private handleBuyMax = () => {
    this.dispatchEvent(new BuyMaxHardwareEvent());
  };

  handlePartialUpdate = () => {
    if (!this._parameter) {
      return;
    }

    const warning = this.selectWarning();
    this._warningElements.forEach((warningElement) => {
      if (warningElement.dataset.warning === warning) {
        warningElement.classList.add('visible');
      } else {
        warningElement.classList.remove('visible');
      }
    });

    this.updateAvailabilityTimer();
    this.updateUpgradeLevel();
  };
}
