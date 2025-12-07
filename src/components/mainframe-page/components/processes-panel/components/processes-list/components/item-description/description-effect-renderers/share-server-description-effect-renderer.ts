import { html } from 'lit';
import { IProcess, ShareServerProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter, MS_IN_SECOND } from '@shared/index';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

const VALUES = {
  money: 'money',
  developmentPoints: 'development-points',
};

export class ShareServerDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {
    [VALUES.money]: '',
    [VALUES.developmentPoints]: '',
  };

  private _process: IProcess;

  private _formatter: IFormatter;

  private _availableRam: number;

  constructor(parameters: IDescriptionParameters) {
    this._process = parameters.process;
    this._formatter = parameters.formatter;
    this._availableRam = parameters.availableRam;
  }

  public renderEffect = () => {
    return html`
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.money](),
          COMMON_TEXTS.parameterSpeed(html`<span data-value=${VALUES.money}></span>`),
        )}
      </p>
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.developmentPoints](),
          COMMON_TEXTS.parameterSpeed(html`<span data-value=${VALUES.developmentPoints}></span>`),
        )}
      </p>
    `;
  };

  public recalculateValues() {
    const { usedCores } = this._process;
    const program = this._process.program as ShareServerProgram;

    const money = program.calculateMoneyDelta(usedCores, this._availableRam, MS_IN_SECOND);
    const developmentPoints = program.calculateDevelopmentPointsDelta(usedCores, this._availableRam, MS_IN_SECOND);

    this.values[VALUES.money] = this._formatter.formatNumberFloat(money);
    this.values[VALUES.developmentPoints] = this._formatter.formatNumberFloat(developmentPoints);
  }
}
