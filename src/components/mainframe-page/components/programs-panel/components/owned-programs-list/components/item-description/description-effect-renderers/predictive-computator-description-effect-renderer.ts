import { html } from 'lit';
import { PredictiveComputatorProgram } from '@state/mainframe-state';
import { IFormatter, RewardParameter } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

const VALUES = {
  processCompletionSpeed: 'process-completion-speed',
};

export class PredictiveComputatorDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {
    [VALUES.processCompletionSpeed]: '',
  };

  private _program: PredictiveComputatorProgram;

  private _formatter: IFormatter;

  private _ram: number;

  private _cores: number;

  constructor(parameters: IDescriptionParameters) {
    this._program = parameters.program as PredictiveComputatorProgram;
    this._formatter = parameters.formatter;
    this._ram = parameters.ram;
    this._cores = parameters.cores;
  }

  public renderEffect = () => {
    return html`<p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[RewardParameter.processCompletionSpeed](),
        PROGRAM_DESCRIPTION_TEXTS.upToValue(html`<span data-value=${VALUES.processCompletionSpeed}></span>`),
      )}
    </p>`;
  };

  public recalculateValues() {
    const formattedValue = this._formatter.formatNumberFloat(
      this._program.calculateProcessCompletionSpeedMultiplier(this._cores, this._ram),
    );

    this.values[VALUES.processCompletionSpeed] = formattedValue;
  }
}
