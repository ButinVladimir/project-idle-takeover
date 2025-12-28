import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { type IProgram } from '@state/mainframe-state';
import {
  BaseComponent,
  getHighlightValueClass,
  diffFormatterParameters,
  getHighlightDifferenceClassMap,
  getHighlightDifferenceClass,
} from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, PROGRAM_TEXTS } from '@texts/index';
import { rendererMap } from './description-effect-renderers';
import { IDescriptionEffectRenderer, IDescriptionParameters } from './interfaces';
import { ProgramDiffTextController } from './controller';
import { existingProgramContext, temporaryProgramContext } from '../../contexts';
import styles from './styles';

@localized()
@customElement('ca-purchase-program-dialog-description')
export class PurchaseProgramDialogDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  @consume({ context: temporaryProgramContext, subscribe: true })
  private _program?: IProgram;

  @consume({ context: existingProgramContext, subscribe: true })
  private _ownedProgram?: IProgram;

  private _controller: ProgramDiffTextController;

  private _renderer?: IDescriptionEffectRenderer;

  @queryAll('span[data-value]')
  private _valueEls!: NodeListOf<HTMLSpanElement>;

  @queryAll('span[data-diff]')
  private _diffEls!: NodeListOf<HTMLSpanElement>;

  private _costElRef = createRef<HTMLSpanElement>();

  private _minCompletionTimeValueEl = createRef<HTMLSpanElement>();
  private _maxCompletionTimeValueEl = createRef<HTMLSpanElement>();
  private _minCompletionTimeDiffEl = createRef<HTMLSpanElement>();
  private _maxCompletionTimeDiffEl = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new ProgramDiffTextController(this);
  }

  protected renderDesktop() {
    this.updateRenderer();

    if (!this._program) {
      return;
    }

    const requirements = this._program.isAutoscalable
      ? this.renderAutoscalableRequirements()
      : this.renderNormalRequirements();

    const effects = this.renderEffects();

    return html`
      <p>${PROGRAM_TEXTS[this._program.name].overview()}</p>

      <p class="line-break"></p>

      <p class="text">${COMMON_TEXTS.parameterRow(COMMON_TEXTS.cost(), html`<span ${ref(this._costElRef)}></span>`)}</p>

      <p class="line-break"></p>

      ${requirements}

      <p class="line-break"></p>

      <p>${PROGRAM_DESCRIPTION_TEXTS.effects()}</p>

      ${effects}
    `;
  }

  private renderAutoscalableRequirements = () => {
    return html`
      <p>${PROGRAM_DESCRIPTION_TEXTS.requirementsAutoscalable()}</p>

      <p>
        ${COMMON_TEXTS.parameterRow(
          PROGRAM_DESCRIPTION_TEXTS.ram(),
          PROGRAM_DESCRIPTION_TEXTS.allAvailable(this._program!.ram),
        )}
      </p>

      <p>${COMMON_TEXTS.parameterRow(PROGRAM_DESCRIPTION_TEXTS.cores(), PROGRAM_DESCRIPTION_TEXTS.allAvailable(1))}</p>

      <p>${COMMON_TEXTS.parameterRow(COMMON_TEXTS.completionTime(), PROGRAM_DESCRIPTION_TEXTS.instant())}</p>
    `;
  };

  private renderNormalRequirements = () => {
    const formatter = this._controller.formatter;

    const coresDiff = this._ownedProgram ? this._program!.cores - this._ownedProgram.cores : this._program!.cores;

    const formattedRam = formatter.formatNumberDecimal(this._program!.ram);
    const formattedCores = formatter.formatNumberDecimal(this._program!.cores);

    const coresDiffClass = getHighlightDifferenceClassMap(coresDiff);
    const coresDiffEl = html`<span class=${coresDiffClass}
      >${formatter.formatNumberDecimal(coresDiff, diffFormatterParameters)}</span
    >`;

    return html`
      <p>${PROGRAM_DESCRIPTION_TEXTS.requirementsSingle()}</p>

      <p>${COMMON_TEXTS.parameterRow(PROGRAM_DESCRIPTION_TEXTS.ram(), formattedRam)}</p>

      <p>
        ${COMMON_TEXTS.parameterRow(
          PROGRAM_DESCRIPTION_TEXTS.cores(),
          PROGRAM_DESCRIPTION_TEXTS.upToDiff(formattedCores, coresDiffEl),
        )}
      </p>

      <p>
        ${COMMON_TEXTS.parameterRow(
          COMMON_TEXTS.completionTime(),
          PROGRAM_DESCRIPTION_TEXTS.minMaxIntervalDiff(
            html`<span ${ref(this._minCompletionTimeValueEl)}></span>`,
            html`<span ${ref(this._maxCompletionTimeValueEl)}></span>`,
            html`<span ${ref(this._minCompletionTimeDiffEl)}></span>`,
            html`<span ${ref(this._maxCompletionTimeDiffEl)}></span>`,
          ),
        )}
      </p>
    `;
  };

  private renderEffects = () => {
    if (!this._renderer) {
      return nothing;
    }

    return this._renderer.renderEffect();
  };

  handlePartialUpdate = () => {
    if (!this._renderer) {
      return;
    }

    this.renderCost();

    this._renderer.recalculateValues();

    this._valueEls.forEach((valueEl) => {
      valueEl.textContent = this._renderer!.values[valueEl.dataset.value!];
    });

    this._diffEls.forEach((diffEl) => {
      const { value, className } = this._renderer!.diffs[diffEl.dataset.diff!];

      diffEl.textContent = value;
      diffEl.className = className;
    });

    this.updateCompletionTime();
  };

  private renderCost() {
    if (!this._costElRef.value) {
      return;
    }

    const cost = this._controller.getProgramCost(this._program!.name, this._program!.tier, this._program!.level);
    const money = this._controller.money;

    const formattedCost = this._controller.formatter.formatNumberFloat(cost);
    const className = getHighlightValueClass(money >= cost);

    this._costElRef.value.textContent = formattedCost;
    this._costElRef.value.className = className;
  }

  private updateRenderer(): void {
    if (!this._program) {
      this._renderer = undefined;
      return;
    }

    const parameters: IDescriptionParameters = {
      formatter: this._controller.formatter,
      program: this._program!,
      ownedProgram: this._ownedProgram,
      cores: this._controller.cores,
      ram: this._controller.ram,
    };

    this._renderer = new rendererMap[this._program!.name](parameters);
  }

  private updateCompletionTime() {
    if (!this._program) {
      return;
    }

    const formatter = this._controller.formatter;

    const minTime = this._program!.calculateCompletionMinTime(1);
    const minTimeDiff = this._ownedProgram ? minTime - this._ownedProgram.calculateCompletionMinTime(1) : minTime;
    const maxTime = this._program!.calculateCompletionMaxTime(1);
    const maxTimeDiff = this._ownedProgram ? maxTime - this._ownedProgram.calculateCompletionMaxTime(1) : maxTime;

    const formattedMinTime = formatter.formatTimeShort(minTime);
    const formattedMaxTime = formatter.formatTimeShort(maxTime);

    const minTimeDiffClass = getHighlightDifferenceClass(-minTimeDiff);
    const minTimeDiffLabel = formatter.formatTimeShort(minTimeDiff, diffFormatterParameters);

    const maxTimeDiffClass = getHighlightDifferenceClass(-maxTimeDiff);
    const maxTimeDiffLabel = formatter.formatTimeShort(maxTimeDiff, diffFormatterParameters);

    if (this._minCompletionTimeValueEl.value) {
      this._minCompletionTimeValueEl.value.textContent = formattedMinTime;
    }

    if (this._maxCompletionTimeValueEl.value) {
      this._maxCompletionTimeValueEl.value.textContent = formattedMaxTime;
    }

    if (this._minCompletionTimeDiffEl.value) {
      this._minCompletionTimeDiffEl.value.textContent = minTimeDiffLabel;
      this._minCompletionTimeDiffEl.value.className = minTimeDiffClass;
    }

    if (this._maxCompletionTimeDiffEl.value) {
      this._maxCompletionTimeDiffEl.value.textContent = maxTimeDiffLabel;
      this._maxCompletionTimeDiffEl.value.className = maxTimeDiffClass;
    }
  }
}
