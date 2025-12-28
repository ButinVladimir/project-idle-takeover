import { html, nothing } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { type IProcess, type IProgram } from '@state/mainframe-state';
import {
  BaseComponent,
  diffFormatterParameters,
  getHighlightDifferenceClass,
  getHighlightDifferenceClassMap,
  getHighlightValueClassMap,
} from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, PROGRAM_TEXTS } from '@texts/index';
import { rendererMap } from './description-effect-renderers';
import { IDescriptionEffectRenderer, IDescriptionParameters } from './interfaces';
import { ProcessDiffTextController } from './controller';
import { existingProcessContext, programContext } from '../../contexts';
import styles from './styles';

@localized()
@customElement('ca-start-process-dialog-description')
export class StartProcessDialogDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  @property({
    attribute: 'threads',
    type: Number,
  })
  threads = 0;

  private _controller: ProcessDiffTextController;

  private _renderer?: IDescriptionEffectRenderer;

  @queryAll('span[data-value]')
  private _valueEls!: NodeListOf<HTMLSpanElement>;

  @queryAll('span[data-diff]')
  private _diffEls!: NodeListOf<HTMLSpanElement>;

  private _minCompletionTimeValueEl = createRef<HTMLSpanElement>();
  private _maxCompletionTimeValueEl = createRef<HTMLSpanElement>();
  private _minCompletionTimeDiffEl = createRef<HTMLSpanElement>();
  private _maxCompletionTimeDiffEl = createRef<HTMLSpanElement>();

  @consume({ context: programContext, subscribe: true })
  private _program?: IProgram;

  @consume({ context: existingProcessContext, subscribe: true })
  private _existingProcess?: IProcess;

  constructor() {
    super();

    this._controller = new ProcessDiffTextController(this);
  }

  protected renderDesktop() {
    this.updateRenderer();

    if (!this._program) {
      return nothing;
    }

    const requirements = this._program.isAutoscalable
      ? this.renderAutoscalableRequirements()
      : this.renderNormalRequirements();

    const effects = this.renderEffects();

    return html`
      <p>${PROGRAM_TEXTS[this._program.name].overview()}</p>

      <p class="line-break"></p>

      ${requirements}

      <p class="line-break"></p>

      <p>${msg('Effects')}</p>

      ${effects}
    `;
  }

  private renderAutoscalableRequirements = () => {
    const availableRam = this._controller.getAvailableRamForProgram(this._program!.name);
    const programRam = this._program!.ram;
    const ramClass = getHighlightValueClassMap(availableRam >= programRam);
    const ramEl = html`<span class=${ramClass}>${PROGRAM_DESCRIPTION_TEXTS.allAvailable(programRam)}</span>`;

    return html`
      <p>${PROGRAM_DESCRIPTION_TEXTS.requirementsAutoscalable()}</p>

      <p>${COMMON_TEXTS.parameterRow(PROGRAM_DESCRIPTION_TEXTS.ram(), ramEl)}</p>

      <p>${COMMON_TEXTS.parameterRow(PROGRAM_DESCRIPTION_TEXTS.cores(), PROGRAM_DESCRIPTION_TEXTS.allAvailable(1))}</p>

      <p>${COMMON_TEXTS.parameterRow(COMMON_TEXTS.completionTime(), PROGRAM_DESCRIPTION_TEXTS.instant())}</p>
    `;
  };

  private renderNormalRequirements = () => {
    const currentThreads = this._existingProcess ? this._existingProcess.threads : 0;
    const formatter = this._controller.formatter;

    const threadsDiff = this.threads - currentThreads;

    const programRam = this._program!.ram * this.threads;

    const formattedThreads = formatter.formatNumberDecimal(this.threads);
    const threadsDiffClass = getHighlightDifferenceClassMap(threadsDiff);
    const threadsDiffEl = html`<span class=${threadsDiffClass}
      >${formatter.formatNumberDecimal(threadsDiff, diffFormatterParameters)}</span
    >`;

    const ramDiff = programRam - this._program!.ram * currentThreads;
    const availableRam = this._controller.getAvailableRamForProgram(this._program!.name);

    const formattedRam = formatter.formatNumberDecimal(programRam);
    const formattedAvailableRam = formatter.formatNumberDecimal(availableRam);
    const ramClass = getHighlightValueClassMap(availableRam >= programRam);
    const ramEl = html`<span class=${ramClass}>${formattedRam} / ${formattedAvailableRam}</span>`;

    const ramDiffClass = getHighlightDifferenceClassMap(-ramDiff);
    const ramDiffEl = html`<span class=${ramDiffClass}
      >${formatter.formatNumberDecimal(ramDiff, diffFormatterParameters)}</span
    >`;

    const cores = this._program!.cores * this.threads;
    const coresDiff = cores - this._program!.cores * currentThreads;

    const formattedCores = formatter.formatNumberDecimal(cores);

    const coresDiffClass = getHighlightDifferenceClassMap(coresDiff);
    const coresDiffEl = html`<span class=${coresDiffClass}
      >${formatter.formatNumberDecimal(coresDiff, diffFormatterParameters)}</span
    >`;

    return html`
      <p>${PROGRAM_DESCRIPTION_TEXTS.requirementsDiff(formattedThreads, threadsDiffEl)}</p>

      <p>${COMMON_TEXTS.parameterRow(PROGRAM_DESCRIPTION_TEXTS.ram(), html`${ramEl} (${ramDiffEl})`)}</p>

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
    if (!this._renderer || !this._program) {
      return;
    }

    this._renderer.recalculateValues();

    this._valueEls.forEach((valueEl) => {
      valueEl.textContent = this._renderer!.values[valueEl.dataset.value!];
    });

    this._diffEls.forEach((diffEl) => {
      const { value, className } = this._renderer!.diffs[diffEl.dataset.diff!];

      diffEl.className = className;
      diffEl.textContent = value;
    });

    this.updateCompletionTime();
  };

  private updateRenderer(): void {
    if (!this._program) {
      this._renderer = undefined;
      return;
    }

    const currentThreads = this._existingProcess ? this._existingProcess.threads : 0;

    const parameters: IDescriptionParameters = {
      formatter: this._controller.formatter,
      program: this._program!,
      maxCores: this._controller.maxCores,
      maxRam: this._controller.maxRam,
      threads: this.threads,
      currentThreads,
    };

    this._renderer = new rendererMap[this._program!.name](parameters);
  }

  private updateCompletionTime() {
    if (!this._program) {
      return;
    }

    const currentThreads = this._existingProcess ? this._existingProcess.threads : 0;
    const formatter = this._controller.formatter;

    const minTime = this._program!.calculateCompletionMinTime(this.threads);
    const maxTime = this._program!.calculateCompletionMaxTime(this.threads);

    let minTimeDiff = 0;
    let maxTimeDiff = 0;

    if (currentThreads > 0) {
      minTimeDiff = minTime - this._program!.calculateCompletionMinTime(currentThreads);
      maxTimeDiff = maxTime - this._program!.calculateCompletionMaxTime(currentThreads);
    }

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
