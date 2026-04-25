import { html } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import clamp from 'lodash/clamp';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { consume, provide } from '@lit/context';
import { BaseComponent, CloneAlert, compareOptions, ISelectOption } from '@shared/index';
import { COMMON_TEXTS, CLONE_TEMPLATE_TEXTS } from '@texts/index';
import { type IClone } from '@state/clones-state';
import { PurchaseCloneDialogController } from './controller';
import { temporaryCloneContext } from './contexts';
import styles from './styles';
import { PurchaseCloneDialogButtons } from './components/buttons/component';
import { CloseCloneListItemDialogEvent } from '../../events';
import { modalSelectedCloneContext } from '../../contexts';

@localized()
@customElement('ca-purchase-clone-dialog')
export class PurchaseCloneDialog extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  protected hasMobileRender = true;

  private _controller: PurchaseCloneDialogController;

  @consume({ context: modalSelectedCloneContext, subscribe: true })
  private _selectedClone?: IClone;

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
  private _cloneTemplateName?: string = undefined;

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

  disconnectedCallback() {
    super.disconnectedCallback();

    this._clone?.removeAllEventListeners();
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._name = this._selectedClone?.name ?? '';
      this._cloneTemplateName = this._selectedClone?.templateName ?? undefined;
      this._tier = this._selectedClone?.tier ?? 0;
      this._level = this._selectedClone?.level ?? this._controller.developmentLevel;

      if (this.open && !this._selectedClone) {
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
          <h4 slot="label" class="title">
            ${this._selectedClone ? msg(str`Replace clone ${this._selectedClone.name}`) : msg('Purchase clone')}
          </h4>

          <div class="body">
            <p class="hint">
              ${this._selectedClone
                ? msg(`Select clone template, tier and level to replace it.
Tier is limited depending on design and loaned items tier.
Clone level cannot be above development level.
Synchronization is earned by unlocking districts, raising their tier and by gaining certain upgrades.
Clone will lose it's upgrades after replacement but will keep assigned activities.
Activities that are already in progress won't be affected.`)
                : msg(`Select clone name, template, tier and level to purchase it.
Tier is limited depending on design and loaned items tier.
Clone level cannot be above development level.
Synchronization is earned by unlocking districts, raising their tier and by gaining certain upgrades.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-input
                ${ref(this._nameInputRef)}
                ?disabled=${this._selectedClone ? true : false}
                name="name"
                value=${this._selectedClone?.name ?? this._name}
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

                ${this.renderCloneTemplateOptions()}
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
            @restore-values=${this.handleRestoreValues}
          >
          </ca-purchase-clone-dialog-buttons>
        </sl-dialog>
      </form>
    `;
  }

  handlePartialUpdate = () => {
    if (this._buttonsRef.value) {
      this._buttonsRef.value.disabled = !this.validate();
    }
  };

  private renderCloneTemplateOptions = () => {
    const options: ISelectOption[] = this._controller.listAvailableCloneTemplates().map((cloneTemplate) => ({
      name: CLONE_TEMPLATE_TEXTS[cloneTemplate].title(),
      value: cloneTemplate,
    }));
    options.sort(compareOptions);

    return options.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
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

  protected updateContext() {
    this._clone?.removeAllEventListeners();

    if (this._cloneTemplateName !== undefined) {
      this._clone = this._controller.getClone(
        this._selectedClone?.id ?? '',
        this._name,
        this._cloneTemplateName,
        this._tier,
        this._level,
      );
    } else {
      this._clone = undefined;
    }
  }

  private handleClose = () => {
    this.dispatchEvent(new CloseCloneListItemDialogEvent());
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

    const cloneTemplateName = this._cloneTemplateInputRef.value.value as string;
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

    const level = clamp(this._levelInputRef.value.valueAsNumber - 1, 0, this._controller.developmentLevel);
    this._level = level;
    this._levelInputRef.value.valueAsNumber = level + 1;
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.validate()) {
      return;
    }

    if (this._selectedClone) {
      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          CloneAlert.cloneReplace,
          msg(
            str`Are you sure want to replace clone "${this._selectedClone.name}"? It will keep assigned sidejobs and primary activities but will lose augmentations, items and enhancements.`,
          ),
          this.handlePurchaseClone,
        ),
      );
    } else {
      this.handlePurchaseClone();
    }
  };

  private handleGenerateName = () => {
    this._name = this._controller.generateName();
  };

  private validate(): boolean {
    if (!this._clone) {
      return false;
    }

    return this._controller.validateClone(this._clone);
  }

  private handleRestoreValues = (event: Event) => {
    event?.preventDefault();

    if (!this._selectedClone) {
      return;
    }

    this._cloneTemplateName = this._selectedClone.templateName;
    this._tier = this._selectedClone.tier;
    this._level = this._selectedClone.level;
  };

  private handlePurchaseClone = () => {
    const isBought = this._controller.purchaseClone({
      id: this._selectedClone?.id ?? undefined,
      name: this._selectedClone?.name ?? this._name,
      templateName: this._cloneTemplateName!,
      tier: this._tier,
      level: this._level,
    });

    if (isBought) {
      this.dispatchEvent(new CloseCloneListItemDialogEvent());
    }
  };
}
