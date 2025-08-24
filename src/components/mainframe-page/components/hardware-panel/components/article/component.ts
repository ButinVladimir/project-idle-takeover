import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { COMMON_TEXTS } from '@texts/index';
import { BaseComponent, AUTOUPGRADE_VALUES, getHighlightValueClass } from '@shared/index';
import { type IMainframeHardwareParameter, type MainframeHardwareParameterType } from '@state/mainframe-state';
import { MainframeHardwarePanelArticleController } from './controller';
import { MAINFRAME_HARDWARE_TEXTS } from './constants';
import { mainframeHardwareParameterContext } from './contexts';
import styles from './styles';
import { MainframeHardwarePanelArticleButtons } from './components/buttons/component';

@localized()
@customElement('ca-mainframe-hardware-panel-article')
export class MainframeHardwarePanelArticle extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  protected hasMobileRender = true;

  @property({
    attribute: 'type',
    type: String,
  })
  type!: MainframeHardwareParameterType;

  @property({
    attribute: 'increase',
    type: Number,
  })
  increase!: number;

  private _controller: MainframeHardwarePanelArticleController;

  private _costElRef = createRef<HTMLSpanElement>();

  private _buttonsRef = createRef<MainframeHardwarePanelArticleButtons>();

  @provide({ context: mainframeHardwareParameterContext })
  private _parameter?: IMainframeHardwareParameter;

  constructor() {
    super();

    this._controller = new MainframeHardwarePanelArticleController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
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

    const formatter = this._controller.formatter;

    const level = this._parameter.level;

    const isAutoupgradeEnabled = this._parameter.autoUpgradeEnabled;

    const autoupgradeIcon = isAutoupgradeEnabled ? AUTOUPGRADE_VALUES.icon.enabled : AUTOUPGRADE_VALUES.icon.disabled;
    const autoupgradeLabel = isAutoupgradeEnabled
      ? COMMON_TEXTS.disableAutoupgrade()
      : COMMON_TEXTS.enableAutoupgrade();

    return html`
      <form id="hardware-panel-article-${this.type}" @submit=${this.handleSubmit}>
        <div class="title-row">
          <h4 class="title" draggable="true" @dragstart=${this.handleDragStart}>
            <sl-icon id="drag-icon" name="grip-vertical"> </sl-icon>

            ${COMMON_TEXTS.parameterValue(MAINFRAME_HARDWARE_TEXTS[this.type].title(), formatter.formatLevel(level))}

            <sl-tooltip>
              <span slot="content"> ${autoupgradeLabel} </span>

              <sl-icon-button
                id="toggle-autoupgrade-btn"
                name=${autoupgradeIcon}
                label=${autoupgradeLabel}
                @click=${this.handleToggleAutoUpgrade}
              >
              </sl-icon-button>
            </sl-tooltip>
          </h4>
        </div>

        <p class="cost">
          ${COMMON_TEXTS.parameterValue(COMMON_TEXTS.cost(), html`<span ${ref(this._costElRef)}></span>`)}
        </p>

        <p class="hint">${MAINFRAME_HARDWARE_TEXTS[this.type].hint()}</p>

        <div class="button-container">
          <ca-mainframe-hardware-panel-article-buttons
            ${ref(this._buttonsRef)}
            increase=${this.increase}
            @buy-hardware=${this.handleSubmit}
            @buy-max-hardware=${this.handleBuyMax}
          >
          </ca-mainframe-hardware-panel-article-buttons>
        </div>
      </form>
    `;
  };

  private updateContext() {
    this._parameter = this._controller.getParameter(this.type);
  }

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    this._parameter?.purchase(this.increase);
  };

  private handleBuyMax = () => {
    if (this._parameter) {
      this._controller.purchaseMaxParameter(this._parameter.type);
    }
  };

  private handleToggleAutoUpgrade = () => {
    if (!this._parameter) {
      return;
    }

    this._parameter.autoUpgradeEnabled = !this._parameter.autoUpgradeEnabled;
  };

  private handleDragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.type);
    }
  };

  handlePartialUpdate = () => {
    if (!this._costElRef.value || !this._parameter) {
      return;
    }

    const cost = this._parameter.calculateIncreaseCost(this.increase);
    const money = this._controller.money;

    const formattedCost = this._controller.formatter.formatNumberFloat(cost);
    const className = getHighlightValueClass(money >= cost);

    this._costElRef.value.textContent = formattedCost;
    this._costElRef.value.className = className;

    if (this._buttonsRef.value) {
      const value = this._buttonsRef.value;

      value.disabled = !this._parameter.checkCanPurchase(this.increase);
      value.disabledBuyAll = !this._parameter.checkCanPurchase(1);
    }
  };
}
