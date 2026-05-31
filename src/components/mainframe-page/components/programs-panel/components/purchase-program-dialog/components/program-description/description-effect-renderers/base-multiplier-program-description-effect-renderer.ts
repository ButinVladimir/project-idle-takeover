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

  protected abstract parameterName: RewardParameter;

  constructor(parameters: IDescriptionParameters) {
    this.program = parameters.program;
    this.ownedProgram = parameters.ownedProgram;
    this.formatter = parameters.formatter;
  }

  public renderEffect = () => {
    return html` <p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[RewardParameter.computationalBase](),
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
    const value = this.getProgramValue();
    const minTime = this.program.calculateCompletionMinTime(1);
    const maxTime = this.program.calculateCompletionMaxTime(1);
    const minAvgValue = (value / maxTime) * MS_IN_SECOND;
    const maxAvgValue = (value / minTime) * MS_IN_SECOND;

    let valueDiff = value;
    let minAvgValueDiff = minAvgValue;
    let maxAvgValueDiff = maxAvgValue;

    if (this.ownedProgram) {
      const ownedValue = this.getOwnedProgramValue();
      const ownedMinTime = this.ownedProgram.calculateCompletionMinTime(1);
      const ownedMaxTime = this.ownedProgram.calculateCompletionMaxTime(1);
      const ownedMinAvgValue = (ownedValue / ownedMaxTime) * MS_IN_SECOND;
      const ownedMaxAvgValue = (ownedValue / ownedMinTime) * MS_IN_SECOND;

      valueDiff = value - ownedValue;
      minAvgValueDiff = minAvgValue - ownedMinAvgValue;
      maxAvgValueDiff = maxAvgValue - ownedMaxAvgValue;
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

  protected abstract getProgramValue(): number;

  protected abstract getOwnedProgramValue(): number;
}
