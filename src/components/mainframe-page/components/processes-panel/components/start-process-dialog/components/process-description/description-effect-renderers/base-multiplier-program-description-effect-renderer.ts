import { html } from 'lit';
import { IProgram } from '@state/mainframe-state';
import {
  RewardParameter,
  IFormatter,
  diffFormatterParameters,
  MS_IN_SECOND,
  getHighlightDifferenceClass,
} from '@shared/index';
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

  public readonly diffs = {
    [VALUES.value]: { value: '', className: '' },
    [VALUES.minAvgValue]: { value: '', className: '' },
    [VALUES.maxAvgValue]: { value: '', className: '' },
  };

  protected program: IProgram;

  protected ownedProgram?: IProgram;

  protected formatter: IFormatter;

  protected threads: number;

  protected currentThreads: number;

  protected abstract parameterName: RewardParameter;

  constructor(parameters: IDescriptionParameters) {
    this.program = parameters.program;
    this.formatter = parameters.formatter;
    this.threads = parameters.threads;
    this.currentThreads = parameters.currentThreads;
  }

  public renderEffect = () => {
    return html` <p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[this.parameterName](),
        PROGRAM_DESCRIPTION_TEXTS.parameterCompletionDiffs(
          html`<span data-value=${VALUES.value}></span>`,
          html`<span data-diff=${VALUES.value}></span>`,
          html`<span data-value=${VALUES.minAvgValue}></span>`,
          html`<span data-diff=${VALUES.minAvgValue}></span>`,
          html`<span data-value=${VALUES.maxAvgValue}></span>`,
          html`<span data-diff=${VALUES.maxAvgValue}></span>`,
        ),
      )}
    </p>`;
  };

  public recalculateValues() {
    const value = this.getProgramValue(this.threads);
    const minTime = this.program.calculateCompletionMinTime(this.threads);
    const maxTime = this.program.calculateCompletionMaxTime(this.threads);
    const minAvgValue = (value / maxTime) * MS_IN_SECOND;
    const maxAvgValue = (value / minTime) * MS_IN_SECOND;

    let valueDiff = value;
    let minAvgValueDiff = minAvgValue;
    let maxAvgValueDiff = maxAvgValue;

    if (this.currentThreads) {
      const currentValue = this.getProgramValue(this.currentThreads);
      const currentMinTime = this.program.calculateCompletionMinTime(this.currentThreads);
      const currentMaxTime = this.program.calculateCompletionMaxTime(this.currentThreads);
      const currentMinAvgValue = (currentValue / currentMaxTime) * MS_IN_SECOND;
      const currentMaxAvgValue = (currentValue / currentMinTime) * MS_IN_SECOND;

      valueDiff = value - currentValue;
      minAvgValueDiff = minAvgValue - currentMinAvgValue;
      maxAvgValueDiff = maxAvgValue - currentMaxAvgValue;
    }

    this.values[VALUES.value] = this.formatter.formatNumberFloat(value);
    this.diffs[VALUES.value].value = this.formatter.formatNumberFloat(valueDiff, diffFormatterParameters);
    this.diffs[VALUES.value].className = getHighlightDifferenceClass(valueDiff);

    this.values[VALUES.minAvgValue] = this.formatter.formatNumberFloat(minAvgValue);
    this.diffs[VALUES.minAvgValue].value = this.formatter.formatNumberFloat(minAvgValueDiff, diffFormatterParameters);
    this.diffs[VALUES.minAvgValue].className = getHighlightDifferenceClass(minAvgValueDiff);

    this.values[VALUES.maxAvgValue] = this.formatter.formatNumberFloat(maxAvgValue);
    this.diffs[VALUES.maxAvgValue].value = this.formatter.formatNumberFloat(maxAvgValueDiff, diffFormatterParameters);
    this.diffs[VALUES.maxAvgValue].className = getHighlightDifferenceClass(maxAvgValueDiff);
  }

  protected abstract getProgramValue(threads: number): number;
}
