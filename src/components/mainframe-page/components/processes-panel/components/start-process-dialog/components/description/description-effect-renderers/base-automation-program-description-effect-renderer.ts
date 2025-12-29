import { html } from 'lit';
import {
  RewardParameter,
  IFormatter,
  diffFormatterParameters,
  MS_IN_SECOND,
  getHighlightDifferenceClass,
} from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

export abstract class BaseAutomationProgramDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {};
  public readonly diffs = {};

  protected program;

  protected formatter: IFormatter;

  protected threads: number;

  protected currentThreads: number;

  constructor(parameters: IDescriptionParameters) {
    this.program = parameters.program;
    this.formatter = parameters.formatter;
    this.threads = parameters.threads;
    this.currentThreads = parameters.currentThreads;
  }

  public renderEffect = () => {
    const actionCount = this.getActionCount();
    const minTime = this.program.calculateCompletionMinTime(actionCount);
    const maxTime = this.program.calculateCompletionMaxTime(actionCount);
    const minAvgValue = (actionCount / maxTime) * MS_IN_SECOND;
    const maxAvgValue = (actionCount / minTime) * MS_IN_SECOND;

    let valueDiff = actionCount;
    let minAvgValueDiff = minAvgValue;
    let maxAvgValueDiff = maxAvgValue;

    if (this.currentThreads) {
      const currentActionCount = this.getCurrentActionCount();
      const currentMinTime = this.program.calculateCompletionMinTime(currentActionCount);
      const currentMaxTime = this.program.calculateCompletionMaxTime(currentActionCount);
      const currentMinAvgValue = (currentActionCount / currentMaxTime) * MS_IN_SECOND;
      const currentMaxAvgValue = (currentActionCount / currentMinTime) * MS_IN_SECOND;

      minAvgValueDiff = minAvgValue - currentMinAvgValue;
      maxAvgValueDiff = maxAvgValue - currentMaxAvgValue;
      valueDiff = actionCount - currentActionCount;
    }

    const formattedValue = this.formatter.formatNumberFloat(actionCount);
    const formattedMinAvgValue = this.formatter.formatNumberFloat(minAvgValue);
    const formattedMaxAvgValue = this.formatter.formatNumberFloat(maxAvgValue);

    const diffClass = getHighlightDifferenceClass(valueDiff);
    const diffEl = html`<span class=${diffClass}
      >${this.formatter.formatNumberFloat(valueDiff, diffFormatterParameters)}</span
    >`;

    const minAvgDiffClass = getHighlightDifferenceClass(minAvgValueDiff);
    const minAvgDiffEl = html`<span class=${minAvgDiffClass}
      >${this.formatter.formatNumberFloat(minAvgValueDiff, diffFormatterParameters)}</span
    >`;

    const maxAvgDiffClass = getHighlightDifferenceClass(maxAvgValueDiff);
    const maxAvgDiffEl = html`<span class=${maxAvgDiffClass}
      >${this.formatter.formatNumberFloat(maxAvgValueDiff, diffFormatterParameters)}</span
    >`;

    return html`
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.actions](),
          PROGRAM_DESCRIPTION_TEXTS.parameterCompletionDiffs(
            formattedValue,
            diffEl,
            formattedMinAvgValue,
            minAvgDiffEl,
            formattedMaxAvgValue,
            maxAvgDiffEl,
          ),
        )}
      </p>
    `;
  };

  public recalculateValues(): void {}

  protected abstract getActionCount(): number;

  protected abstract getCurrentActionCount(): number;
}
