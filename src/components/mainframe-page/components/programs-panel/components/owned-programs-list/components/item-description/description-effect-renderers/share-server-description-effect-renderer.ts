import { html } from 'lit';
import { ShareServerProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter, MS_IN_SECOND } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
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

  private _program: ShareServerProgram;

  private _formatter: IFormatter;

  private _ram: number;

  private _cores: number;

  constructor(parameters: IDescriptionParameters) {
    this._program = parameters.program as ShareServerProgram;
    this._formatter = parameters.formatter;
    this._ram = parameters.ram;
    this._cores = parameters.cores;
  }

  public renderEffect = () => {
    return html`
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.money](),
          PROGRAM_DESCRIPTION_TEXTS.upToValue(html`<span data-value=${VALUES.money}></span>`),
        )}
      </p>
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.developmentPoints](),
          PROGRAM_DESCRIPTION_TEXTS.upToValue(html`<span data-value=${VALUES.developmentPoints}></span>`),
        )}
      </p>
    `;
  };

  public recalculateValues() {
    const moneyDelta = this._program.calculateMoneyDelta(this._cores, this._ram, MS_IN_SECOND);
    const developmentPointsDelta = this._program.calculateDevelopmentPointsDelta(this._cores, this._ram, MS_IN_SECOND);

    this.values[VALUES.money] = this._formatter.formatNumberFloat(moneyDelta);
    this.values[VALUES.developmentPoints] = this._formatter.formatNumberFloat(developmentPointsDelta);
  }
}
