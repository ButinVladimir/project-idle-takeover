import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement, queryAll } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, PROGRAM_TEXTS } from '@texts/index';
import { type IProcess } from '@state/mainframe-state';
import { rendererMap } from './description-effect-renderers';
import { IDescriptionEffectRenderer, IDescriptionParameters } from './interfaces';
import { ProcessDescriptionTextController } from './controller';
import { processContext } from '../item/contexts';
import styles from './styles';

@localized()
@customElement('ca-processes-list-item-description')
export class ProcessDescriptionText extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: ProcessDescriptionTextController;

  private _renderer?: IDescriptionEffectRenderer;

  @queryAll('span[data-value]')
  private _valueEls!: NodeListOf<HTMLSpanElement>;

  @consume({ context: processContext, subscribe: true })
  private _process?: IProcess;

  constructor() {
    super();

    this._controller = new ProcessDescriptionTextController(this);
  }

  protected renderDesktop() {
    this.updateRenderer();

    if (!this._process) {
      this._renderer = undefined;

      return nothing;
    }

    const requirements = this._process.program.isAutoscalable
      ? this.renderAutoscalableRequirements()
      : this.renderNormalRequirements();

    const effects = this.renderEffects();

    return html`
      <p>${PROGRAM_TEXTS[this._process.program.name].overview()}</p>

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
        ${COMMON_TEXTS.parameterValue(
          PROGRAM_DESCRIPTION_TEXTS.ram(),
          PROGRAM_DESCRIPTION_TEXTS.allAvailable(this._process!.program.ram),
        )}
      </p>

      <p>
        ${COMMON_TEXTS.parameterValue(PROGRAM_DESCRIPTION_TEXTS.cores(), PROGRAM_DESCRIPTION_TEXTS.allAvailable(1))}
      </p>

      <p>
        ${COMMON_TEXTS.parameterValue(PROGRAM_DESCRIPTION_TEXTS.completionTime(), PROGRAM_DESCRIPTION_TEXTS.instant())}
      </p>
    `;
  };

  private renderNormalRequirements = () => {
    const formatter = this._controller.formatter;

    const completionDelta = this._process!.program.calculateCompletionDelta(
      this._process!.threads,
      this._process!.usedCores,
      1,
    );

    const formattedThreads = formatter.formatNumberDecimal(this._process!.threads);
    const formattedRam = formatter.formatNumberDecimal(this._process!.program.ram * this._process!.threads);
    const formattedCores = formatter.formatNumberDecimal(this._process!.program.cores * this._process!.threads);

    let completionTimeLabel: string;

    if (completionDelta > 0) {
      completionTimeLabel = formatter.formatTimeShort(
        this._process!.program.calculateCompletionTime(this._process!.threads, this._process!.usedCores),
      );
    } else {
      completionTimeLabel = PROGRAM_DESCRIPTION_TEXTS.never();
    }

    return html`
      <p>${PROGRAM_DESCRIPTION_TEXTS.requirementsProcess(formattedThreads)}</p>

      <p>${COMMON_TEXTS.parameterValue(PROGRAM_DESCRIPTION_TEXTS.ram(), formattedRam)}</p>

      <p>
        ${COMMON_TEXTS.parameterValue(
          PROGRAM_DESCRIPTION_TEXTS.cores(),
          PROGRAM_DESCRIPTION_TEXTS.upToValue(formattedCores),
        )}
      </p>

      <p>${COMMON_TEXTS.parameterValue(PROGRAM_DESCRIPTION_TEXTS.completionTime(), completionTimeLabel)}</p>
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

    this._renderer.recalculateValues();

    this._valueEls.forEach((valueEl) => {
      valueEl.textContent = this._renderer!.values[valueEl.dataset.value!];
    });
  };

  private updateRenderer(): void {
    if (!this._process) {
      this._renderer = undefined;
      return;
    }

    const parameters: IDescriptionParameters = {
      formatter: this._controller.formatter,
      availableRam: this._controller.getAvailableRamForProgram(this._process.program.name),
      process: this._process!,
    };

    this._renderer = new rendererMap[this._process!.program.name](parameters);
  }
}
