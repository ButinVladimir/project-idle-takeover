import { html } from 'lit';
import { PredictiveComputatorProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter, diffFormatterParameters, getHighlightDifferenceClass } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

export class PredictiveComputatorDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {};
  public readonly diffs = {};

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
    const value = this._program.calculateProcessCompletionSpeedMultiplier(this._cores, this._ram);
    const valueDiff = this._ownedProgram
      ? value - this._ownedProgram.calculateProcessCompletionSpeedMultiplier(this._cores, this._ram)
      : value;

    const formattedValue = this._formatter.formatNumberFloat(value);

    const valueDiffClass = getHighlightDifferenceClass(valueDiff);
    const valueDiffEl = html`<span class=${valueDiffClass}
      >${this._formatter.formatNumberFloat(valueDiff, diffFormatterParameters)}</span
    >`;

    return html`<p>
      ${COMMON_TEXTS.parameterValue(
        REWARD_PARAMETER_NAMES[RewardParameter.processCompletionSpeed](),
        PROGRAM_DESCRIPTION_TEXTS.upToDiff(formattedValue, valueDiffEl),
      )}
    </p>`;
  };

  public recalculateValues(): void {}
}
