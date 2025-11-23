import { html } from 'lit';
import { PredictiveComputatorProgram, IProcess } from '@state/mainframe-state';
import { IFormatter, RewardParameter } from '@shared/index';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

export class PredictiveComputatorDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {};

  private _process: IProcess;

  private _formatter: IFormatter;

  private _availableRam: number;

  constructor(parameters: IDescriptionParameters) {
    this._process = parameters.process;
    this._formatter = parameters.formatter;
    this._availableRam = parameters.availableRam;
  }

  public renderEffect = () => {
    const { usedCores } = this._process;
    const program = this._process.program as PredictiveComputatorProgram;

    const formattedValue = this._formatter.formatNumberFloat(
      program.calculateProcessCompletionSpeedMultiplier(usedCores, this._availableRam),
    );

    return html`<p>
      ${COMMON_TEXTS.parameterValue(
        REWARD_PARAMETER_NAMES[RewardParameter.processCompletionSpeed](),
        formattedValue,
      )}
    </p>`;
  };

  public recalculateValues() {}
}
