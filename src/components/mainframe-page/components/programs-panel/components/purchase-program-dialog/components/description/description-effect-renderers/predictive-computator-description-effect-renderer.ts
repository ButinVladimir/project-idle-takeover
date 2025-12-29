import { html } from 'lit';
import { PredictiveComputatorProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter, diffFormatterParameters, getHighlightDifferenceClass } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

const VALUES = {
  processCompletionSpeed: 'process-completion-speed',
};

export class PredictiveComputatorDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {
    [VALUES.processCompletionSpeed]: '',
  };
  public readonly diffs = {
    [VALUES.processCompletionSpeed]: { value: '', className: '' },
  };

  private _program: PredictiveComputatorProgram;

  private _ownedProgram?: PredictiveComputatorProgram;

  private _formatter: IFormatter;

  private _ram: number;

  private _cores: number;

  constructor(parameters: IDescriptionParameters) {
    this._program = parameters.program as PredictiveComputatorProgram;
    this._ownedProgram = parameters.ownedProgram as PredictiveComputatorProgram;
    this._formatter = parameters.formatter;
    this._ram = parameters.ram;
    this._cores = parameters.cores;
  }

  public renderEffect = () => {
    return html`<p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[RewardParameter.processCompletionSpeed](),
        PROGRAM_DESCRIPTION_TEXTS.upToDiff(
          html`<span data-value=${VALUES.processCompletionSpeed}></span>`,
          html`<span data-diff=${VALUES.processCompletionSpeed}></span>`,
        ),
      )}
    </p>`;
  };

  public recalculateValues(): void {
    const value = this._program.calculateProcessCompletionSpeedMultiplier(this._cores, this._ram);
    const valueDiff = this._ownedProgram
      ? value - this._ownedProgram.calculateProcessCompletionSpeedMultiplier(this._cores, this._ram)
      : value;

    const formattedValue = this._formatter.formatNumberFloat(value);
    const formattedDiff = this._formatter.formatNumberFloat(valueDiff, diffFormatterParameters);

    this.values[VALUES.processCompletionSpeed] = formattedValue;
    this.diffs[VALUES.processCompletionSpeed].className = getHighlightDifferenceClass(valueDiff);
    this.diffs[VALUES.processCompletionSpeed].value = formattedDiff;
  }
}
