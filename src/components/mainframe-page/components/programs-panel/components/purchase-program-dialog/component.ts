import { html, nothing } from 'lit';
import { provide } from '@lit/context';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import clamp from 'lodash/clamp';
import { type ProgramName, type IProgram } from '@state/mainframe-state';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, ProgramAlert } from '@shared/index';
import { PROGRAM_TEXTS, COMMON_TEXTS } from '@texts/index';
import { PurchaseProgramDialogCloseEvent } from './events';
import { PurchaseProgramDialogController } from './controller';
import { existingProgramContext, temporaryProgramContext } from './contexts';
import styles from './styles';
import { classMap } from 'lit/directives/class-map.js';
import { PurchaseProgramDialogButtons } from './components/buttons/component';

@localized()
@customElement('ca-purchase-program-dialog')
export class PurchaseProgramDialog extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;
  protected hasMobileRender = true;

  private _controller: PurchaseProgramDialogController;

  private _programInputRef = createRef<SlSelect>();

  private _tierInputRef = createRef<SlSelect>();

  private _levelInputRef = createRef<SlInput>();

  private _buttonsRef = createRef<PurchaseProgramDialogButtons>();

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _programName?: ProgramName = undefined;

  @state()
  private _tier = 0;

  @state()
  private _level = 1;

  @provide({ context: temporaryProgramContext })
  private _program?: IProgram;

  @provide({ context: existingProgramContext })
  private _existingProgram?: IProgram;

  constructor() {
    super();

    this._controller = new PurchaseProgramDialogController(this);
  }

  performUpdate() {
    this.updateContext();

    super.performUpdate();
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._programName = undefined;
      this._tier = 0;
      this._level = this._controller.developmentLevel;
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
      desktop: desktop,
      mobile: !desktop,
    });

    return html`
      <form id="purchase-program-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Purchase program')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select program type, tier and level to purchase it.
Tier is limited depending on design and loaned items tier.
Program level cannot be above development level.
If you already have program with same name, old one will be replaced with new one.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-select
                ${ref(this._programInputRef)}
                name="program"
                value=${this._programName ?? ''}
                hoist
                @sl-change=${this.handleProgramChange}
              >
                <span class="input-label" slot="label"> ${msg('Program')} </span>

                ${this._controller.listAvailablePrograms().map(this.renderProgramOption)}
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

            ${this._programName
              ? html`<ca-purchase-program-dialog-description> </ca-purchase-program-dialog-description>`
              : nothing}
          </div>

          <ca-purchase-program-dialog-buttons
            ${ref(this._buttonsRef)}
            slot="footer"
            @buy-program=${this.handleSubmit}
            @cancel=${this.handleClose}
          >
          </ca-purchase-program-dialog-buttons>
        </sl-dialog>
      </form>
    `;
  }

  private updateContext() {
    if (this._programName) {
      this._program = this._controller.getSelectedProgram(this._programName, this._tier, this._level);
      this._existingProgram = this._controller.getOwnedProgram(this._programName);
    } else {
      this._program = undefined;
      this._existingProgram = undefined;
    }
  }

  private renderProgramOption = (program: ProgramName) => {
    return html`<sl-option value=${program}> ${PROGRAM_TEXTS[program].title()} </sl-option>`;
  };

  private renderTierOptions = () => {
    const highestAvailableTier = this._programName ? this._controller.getHighestAvailableTier(this._programName) : 0;
    const formatter = this._controller.formatter;

    const result: unknown[] = [];
    for (let tier = 0; tier <= highestAvailableTier; tier++) {
      result.push(html`<sl-option value=${tier}> ${formatter.formatTier(tier)} </sl-option>`);
    }

    return result;
  };

  private handleClose = () => {
    this.dispatchEvent(new PurchaseProgramDialogCloseEvent());
  };

  private handleProgramChange = () => {
    if (!this._programInputRef.value) {
      return;
    }

    const programName = this._programInputRef.value.value as ProgramName;
    this._programName = programName;
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

    if (!this.checkAvailability()) {
      return;
    }

    const ownedProgram = this._controller.getOwnedProgram(this._programName!);

    if (ownedProgram) {
      const formatter = this._controller.formatter;

      const programTitle = PROGRAM_TEXTS[this._programName!].title();
      const formattedLevel = formatter.formatLevel(ownedProgram.level);
      const formattedTier = formatter.formatTier(ownedProgram.tier);

      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          ProgramAlert.purchaseProgramOverwrite,
          msg(
            str`Are you sure want to purchase program "${programTitle}"? This will replace your current program with tier ${formattedTier} and level ${formattedLevel}.`,
          ),
          this.handlePurchaseProgram,
        ),
      );
    } else {
      this.handlePurchaseProgram();
    }
  };

  private handlePurchaseProgram = () => {
    if (!this._programName) {
      return;
    }

    const isBought = this._controller.purchaseProgram(this._programName, this._tier, this._level);

    if (isBought) {
      this.dispatchEvent(new PurchaseProgramDialogCloseEvent());
    }
  };

  private checkAvailability = (): boolean => {
    if (!this._program || !this._programName) {
      return false;
    }

    const { money } = this._controller;

    const cost = this._controller.getProgramCost(this._program.name, this._program.tier, this._program.level);

    return (
      cost <= money && this._controller.isProgramAvailable(this._program.name, this._program.tier, this._program.level)
    );
  };

  handlePartialUpdate = () => {
    if (this._buttonsRef.value) {
      this._buttonsRef.value.disabled = !this.checkAvailability();
    }
  };
}
