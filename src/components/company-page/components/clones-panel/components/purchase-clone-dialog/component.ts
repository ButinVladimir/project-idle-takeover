import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import clamp from 'lodash/clamp';
import { provide } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { CloneTemplateName } from '@state/company-state/states/clone-factory/types';
import { COMMON_TEXTS, CLONE_TEMPLATE_TEXTS } from '@texts/index';
import { type IClone } from '@state/company-state';
import { PurchaseCloneDialogCloseEvent } from './events';
import { PurchaseCloneDialogController } from './controller';
import { temporaryCloneContext } from './contexts';
import styles from './styles';
import { PurchaseCloneDialogButtons } from './components/buttons/component';

@localized()
@customElement('ca-purchase-clone-dialog')
export class PurchaseCloneDialog extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  protected hasMobileRender = true;

  private _controller: PurchaseCloneDialogController;

  private _nameInputRef = createRef<SlInput>();

  private _cloneTemplateInputRef = createRef<SlSelect>();

  private _tierInputRef = createRef<SlSelect>();

  private _levelInputRef = createRef<SlInput>();

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _name = '';

  @state()
  private _cloneTemplateName?: CloneTemplateName = undefined;

  @state()
  private _tier = 0;

  @state()
  private _level = 1;

  @provide({ context: temporaryCloneContext })
  private _clone?: IClone;

  private _buttonsRef = createRef<PurchaseCloneDialogButtons>();

  constructor() {
    super();

    this._controller = new PurchaseCloneDialogController(this);
  }

  performUpdate() {
    if (this._cloneTemplateName !== undefined) {
      this._clone = this._controller.getClone(this._name, this._cloneTemplateName, this._tier, this._level);
    } else {
      this._clone = undefined;
    }

    super.performUpdate();
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._name = '';
      this._cloneTemplateName = undefined;
      this._tier = 0;
      this._level = this._controller.developmentLevel;

      if (this.open) {
        this._name = this._controller.generateName();
      }
    }
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    const inputsContainerClasses = classMap({
      'inputs-container': true,
      mobile: !desktop,
      desktop: desktop,
    });

    return html`
      <form id="purchase-clone-form" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Purchase clone')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select clone name, template, tier and level to purchase it.
Level cannot be above current development level.
Tier is limited depending on gained favors.
Synchronization is earned by capturing districts and gaining certain favors.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-input
                ${ref(this._nameInputRef)}
                name="name"
                value=${this._name}
                autocomplete="off"
                @sl-change=${this.handleNameChange}
              >
                <span class="input-label" slot="label"> ${msg('Name')} </span>

                <sl-icon-button
                  slot="suffix"
                  label=${msg('Generate name')}
                  name="dice-4"
                  @click=${this.handleGenerateName}
                >
                </sl-icon-button>
              </sl-input>

              <sl-select
                ${ref(this._cloneTemplateInputRef)}
                name="cloneTemplate"
                value=${this._cloneTemplateName ?? ''}
                hoist
                @sl-change=${this.handleCloneTemplateChange}
              >
                <span class="input-label" slot="label"> ${msg('Clone template')} </span>

                ${this._controller.listAvailableCloneTemplates().map(this.renderCloneTemplateOption)}
              </sl-select>

              <sl-select
                ${ref(this._tierInputRef)}
                name="tier"
                value=${this._tier}
                hoist
                @sl-change=${this.handleTierChange}
              >
                <span class="input-label" slot="label"> ${COMMON_TEXTS.tier()} </span>

                ${this.renderTierOptions()}
              </sl-select>

              <sl-input
                ${ref(this._levelInputRef)}
                name="level"
                value=${this._level + 1}
                type="number"
                inputmode="decimal"
                min="1"
                step="1"
                @sl-change=${this.handleLevelChange}
              >
                <span class="input-label" slot="label"> ${COMMON_TEXTS.level()} </span>
              </sl-input>
            </div>

            <ca-purchase-clone-dialog-description></ca-purchase-clone-dialog-description>
          </div>

          <ca-purchase-clone-dialog-buttons
            slot="footer"
            ${ref(this._buttonsRef)}
            disabled
            level=${this._level}
            tier=${this._tier}
            name=${this._name}
            @cancel=${this.handleClose}
            @purchase-clone=${this.handleSubmit}
          >
          </ca-purchase-clone-dialog-buttons>
        </sl-dialog>
      </form>
    `;
  }

  handlePartialUpdate = () => {
    if (this._buttonsRef.value) {
      this._buttonsRef.value.disabled = !this.checkSubmitAvailability();
    }
  };

  private renderCloneTemplateOption = (cloneTemplate: CloneTemplateName) => {
    return html`<sl-option value=${cloneTemplate}> ${CLONE_TEMPLATE_TEXTS[cloneTemplate].title()} </sl-option>`;
  };

  private renderTierOptions = () => {
    const highestAvailableTier = this._cloneTemplateName
      ? this._controller.getHighestAvailableTier(this._cloneTemplateName)
      : 0;
    const formatter = this._controller.formatter;

    const result: unknown[] = [];

    for (let tier = 0; tier <= highestAvailableTier; tier++) {
      result.push(html`<sl-option value=${tier}> ${formatter.formatTier(tier)} </sl-option>`);
    }

    return result;
  };

  private handleClose = () => {
    this.dispatchEvent(new PurchaseCloneDialogCloseEvent());
  };

  private handleNameChange = () => {
    if (!this._nameInputRef.value) {
      return;
    }

    this._name = this._nameInputRef.value.value;
  };

  private handleCloneTemplateChange = () => {
    if (!this._cloneTemplateInputRef.value) {
      return;
    }

    const cloneTemplateName = this._cloneTemplateInputRef.value.value as CloneTemplateName;
    this._cloneTemplateName = cloneTemplateName;
  };

  private handleTierChange = () => {
    if (!this._tierInputRef.value) {
      return;
    }

    const tier = +this._tierInputRef.value.value;
    this._tier = tier;
  };

  private handleLevelChange = () => {
    if (!this._levelInputRef.value) {
      return;
    }

    const level = clamp(this._levelInputRef.value.valueAsNumber - 1, 0, Number.MAX_SAFE_INTEGER);
    this._level = level;
    this._levelInputRef.value.valueAsNumber = level + 1;
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.checkSubmitAvailability()) {
      return;
    }

    const isBought = this._controller.purchaseClone({
      name: this._name,
      templateName: this._cloneTemplateName!,
      tier: this._tier,
      level: this._level,
    });

    if (isBought) {
      this.dispatchEvent(new PurchaseCloneDialogCloseEvent());
    }
  };

  private handleGenerateName = () => {
    this._name = this._controller.generateName();
  };

  private checkSubmitAvailability(): boolean {
    if (!this._clone) {
      return false;
    }

    const { money } = this._controller;

    const cost = this._controller.getCloneCost(this._clone.templateName, this._clone.tier, this._clone.level);
    const synchronization = this._controller.getCloneSynchronization(this._clone.templateName, this._clone.tier);
    const cloneAvailable = this._controller.isCloneAvailable(this._clone.templateName, this._clone.tier);

    return !!(
      this._clone &&
      this._clone.name &&
      cloneAvailable &&
      synchronization <= this._controller.availableSynchronization &&
      cost <= money
    );
  }
}
