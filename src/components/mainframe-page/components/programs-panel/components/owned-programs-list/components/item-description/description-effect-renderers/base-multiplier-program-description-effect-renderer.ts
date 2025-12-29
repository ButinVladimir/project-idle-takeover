import { html } from 'lit';
import { IProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter, MS_IN_SECOND } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

const VALUES = {
  value: 'value',
  minAvgValue: 'min-avg-value',
  maxAvgValue: 'max-avg-value',
};

export abstract class BaseMultiplierDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {
    [VALUES.value]: '',
    [VALUES.minAvgValue]: '',
    [VALUES.maxAvgValue]: '',
  };

  protected program: IProgram;

  protected formatter: IFormatter;

  protected abstract parameterName: RewardParameter;

  constructor(parameters: IDescriptionParameters) {
    this.program = parameters.program;
    this.formatter = parameters.formatter;
  }

  public renderEffect = () => {
    return html`<p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[RewardParameter.computationalBase](),
        PROGRAM_DESCRIPTION_TEXTS.parameterCompletionValues(
          html`<span data-value=${VALUES.value}></span>`,
          html`<span data-value=${VALUES.minAvgValue}></span>`,
          html`<span data-value=${VALUES.maxAvgValue}></span>`,
        ),
      )}
    </p>`;
  };

  public recalculateValues() {
    const value = this.getProgramValue();
    const minTime = this.program.calculateCompletionMinTime(1);
    const maxTime = this.program.calculateCompletionMaxTime(1);
    const minAvgValue = (value / maxTime) * MS_IN_SECOND;
    const maxAvgValue = (value / minTime) * MS_IN_SECOND;

    this.values[VALUES.value] = this.formatter.formatNumberFloat(value);
    this.values[VALUES.minAvgValue] = this.formatter.formatNumberFloat(minAvgValue);
    this.values[VALUES.maxAvgValue] = this.formatter.formatNumberFloat(maxAvgValue);
  }

  protected abstract getProgramValue(): number;
}
