import { html } from 'lit';
import { PredictiveComputatorProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

export class PredictiveComputatorDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {};
  public readonly diffs = {};

  private _program: PredictiveComputatorProgram;

  private _formatter: IFormatter;

  private _ram: number;

  private _cores: number;

  constructor(parameters: IDescriptionParameters) {
    this._program = parameters.program as PredictiveComputatorProgram;
    this._formatter = parameters.formatter;
    this._ram = parameters.maxRam;
    this._cores = parameters.maxCores;
  }

  public renderEffect = () => {
    const formattedValue = this._formatter.formatNumberFloat(
      this._program.calculateProcessCompletionSpeedMultiplier(this._cores, this._ram),
    );

    return html`<p>
      ${COMMON_TEXTS.parameterValue(
        REWARD_PARAMETER_NAMES[RewardParameter.processCompletionSpeed](),
        PROGRAM_DESCRIPTION_TEXTS.upToValue(formattedValue),
      )}
    </p>`;
  };

  public recalculateValues(): void {}
}
