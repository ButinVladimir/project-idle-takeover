import { html } from 'lit';
import { IProcess } from '@state/mainframe-state';
import { RewardParameter, IFormatter, MS_IN_SECOND } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

const VALUES = {
  value: 'value',
  avgValue: 'avg-value',
};

export abstract class BaseMultiplierDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {
    [VALUES.value]: '',
    [VALUES.avgValue]: '',
  };

  protected abstract parameterName: RewardParameter;

  protected process: IProcess;

  protected formatter: IFormatter;

  constructor(parameters: IDescriptionParameters) {
    this.process = parameters.process;
    this.formatter = parameters.formatter;
  }

  public renderEffect = () => {
    return html`<p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[this.parameterName](),
        PROGRAM_DESCRIPTION_TEXTS.processCompletionValues(
          html`<span data-value=${VALUES.value}></span>`,
          html`<span data-value=${VALUES.avgValue}></span>`,
        ),
      )}
    </p> `;
  };

  public recalculateValues() {
    const { usedCores, threads } = this.process;

    const value = this.getProgramValue();
    const time = this.process.program.calculateCompletionTime(threads, usedCores);
    const avgValue = (value / time) * MS_IN_SECOND;

    this.values[VALUES.value] = this.formatter.formatNumberFloat(value);
    this.values[VALUES.avgValue] = this.formatter.formatNumberFloat(avgValue);
  }

  protected abstract getProgramValue(): number;
}
