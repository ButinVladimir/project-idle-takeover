import { html } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import clamp from 'lodash/clamp';
import { type ProgramName } from '@state/mainframe-state';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, compareOptions, ISelectOption, MULTIPLE_SELECT_SEPARATOR, ProgramAlert } from '@shared/index';
import { PROGRAM_TEXTS, COMMON_TEXTS } from '@texts/index';
import { PurchaseProgramDialogCloseEvent } from './events';
import { PurchaseProgramDialogController } from './controller';
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

  private _programsInputRef = createRef<SlSelect>();

  private _tierInputRef = createRef<SlSelect>();

  private _levelInputRef = createRef<SlInput>();

  private _buttonsRef = createRef<PurchaseProgramDialogButtons>();

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _programNames: ProgramName[] = [];

  @state()
  private _tier = 0;

  @state()
  private _level = 1;

  constructor() {
    super();

    this._controller = new PurchaseProgramDialogController(this);
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._programNames = [];
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
          <h4 slot="label" class="title">${msg('Purchase programs')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select programs, tier and level to purchase them.
Tier is limited depending on design and loaned items tier.
Program level cannot be above development level.
If you already have program with same name, old one will be replaced with new one.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-select
                ${ref(this._programsInputRef)}
                name="programs"
                multiple
                clearable
                value=${this._programNames.join(MULTIPLE_SELECT_SEPARATOR)}
                hoist
                @sl-change=${this.handleProgramChange}
              >
                <span class="input-label" slot="label"> ${msg('Programs')} </span>

                ${this.renderProgramNameOptions()}
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

            <ca-purchase-program-dialog-batch-description
              program-names=${this._programNames.join(MULTIPLE_SELECT_SEPARATOR)}
              tier=${this._tier}
              level=${this._level}
            >
            </ca-purchase-program-dialog-batch-description>
          </div>

          <ca-purchase-program-dialog-buttons
            ${ref(this._buttonsRef)}
            program-names=${this._programNames.join(MULTIPLE_SELECT_SEPARATOR)}
            tier=${this._tier}
            level=${this._level}
            slot="footer"
            @buy-program=${this.handleSubmit}
            @cancel=${this.handleClose}
          >
          </ca-purchase-program-dialog-buttons>
        </sl-dialog>
      </form>
    `;
  }

  private renderProgramNameOptions = () => {
    const programs = this._controller.listAvailablePrograms();
    const programOptions: ISelectOption[] = programs.map((programName) => ({
      value: programName,
      name: PROGRAM_TEXTS[programName].title(),
    }));
    programOptions.sort(compareOptions);

    return programOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderTierOptions = () => {
    const highestAvailableTier = this._controller.getHighestAvailableTier(this._programNames);
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
    if (!this._programsInputRef.value) {
      return;
    }

    const programNames = this._programsInputRef.value.value as ProgramName[];
    this._programNames = programNames;
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

    const ownedPrograms = this._programNames.filter((programName) => this._controller.getOwnedProgram(programName));

    if (ownedPrograms.length > 0) {
      const programTitles = ownedPrograms.map((programName) => `"${PROGRAM_TEXTS[programName].title()}"`);

      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          ProgramAlert.purchaseProgramOverwrite,
          msg(
            str`Are you sure want to purchase programs "${programTitles.join(', ')}"? This will replace your currently owned programs.`,
          ),
          this.handlePurchaseProgramsBatch,
        ),
      );
    } else {
      this.handlePurchaseProgramsBatch();
    }
  };

  private handlePurchaseProgramsBatch = () => {
    if (!this._programNames) {
      return;
    }

    const isPurchased = this._controller.purchaseProgramsBatch(this._programNames, this._tier, this._level);

    if (isPurchased) {
      this.dispatchEvent(new PurchaseProgramDialogCloseEvent());
    }
  };

  private validate = (): boolean => {
    if (!this._programNames.length) {
      return false;
    }

    return this._controller.validateProgramsBatch(this._programNames, this._tier, this._level);
  };

  handlePartialUpdate = () => {
    if (this._buttonsRef.value) {
      this._buttonsRef.value.disabled = !this.validate();
    }
  };
}
