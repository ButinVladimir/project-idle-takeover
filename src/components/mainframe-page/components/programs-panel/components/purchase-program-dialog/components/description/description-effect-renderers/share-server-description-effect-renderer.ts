import { html } from 'lit';
import { ShareServerProgram } from '@state/mainframe-state';
import {
  RewardParameter,
  IFormatter,
  MS_IN_SECOND,
  diffFormatterParameters,
  getHighlightDifferenceClass,
} from '@shared/index';
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

  public readonly diffs = {
    [VALUES.money]: { value: '', className: '' },
    [VALUES.developmentPoints]: { value: '', className: '' },
  };

  private _program: ShareServerProgram;

  private _ownedProgram?: ShareServerProgram;

  private _formatter: IFormatter;

  private _ram: number;

  private _cores: number;

  constructor(parameters: IDescriptionParameters) {
    this._program = parameters.program as ShareServerProgram;
    this._ownedProgram = parameters.ownedProgram as ShareServerProgram;
    this._formatter = parameters.formatter;
    this._ram = parameters.ram;
    this._cores = parameters.cores;
  }

  public renderEffect = () => {
    return html`
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.money](),
          PROGRAM_DESCRIPTION_TEXTS.upToDiff(
            html`<span data-value=${VALUES.money}></span>`,
            html`<span data-diff=${VALUES.money}></span>`,
          ),
        )}
      </p>
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.developmentPoints](),
          PROGRAM_DESCRIPTION_TEXTS.upToDiff(
            html`<span data-value=${VALUES.developmentPoints}></span>`,
            html`<span data-diff=${VALUES.developmentPoints}></span>`,
          ),
        )}
      </p>
    `;
  };

  public recalculateValues() {
    const money = this._program.calculateMoneyDelta(this._cores, this._ram, MS_IN_SECOND);
    const moneyDiff = this._ownedProgram
      ? money - this._ownedProgram.calculateMoneyDelta(this._cores, this._ram, MS_IN_SECOND)
      : money;

    const developmentPoints = this._program.calculateDevelopmentPointsDelta(this._cores, this._ram, MS_IN_SECOND);
    const developmentPointsDiff = this._ownedProgram
      ? developmentPoints - this._ownedProgram.calculateDevelopmentPointsDelta(this._cores, this._ram, MS_IN_SECOND)
      : developmentPoints;

    this.values[VALUES.money] = this._formatter.formatNumberFloat(money);
    this.diffs[VALUES.money].className = getHighlightDifferenceClass(moneyDiff);
    this.diffs[VALUES.money].value = this._formatter.formatNumberFloat(moneyDiff, diffFormatterParameters);

    this.values[VALUES.developmentPoints] = this._formatter.formatNumberFloat(developmentPoints);
    this.diffs[VALUES.developmentPoints].className = getHighlightDifferenceClass(developmentPointsDiff);
    this.diffs[VALUES.developmentPoints].value = this._formatter.formatNumberFloat(
      developmentPointsDiff,
      diffFormatterParameters,
    );
  }
}
