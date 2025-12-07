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

export abstract class BaseAutobuyerProgramDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {};
  public readonly diffs = {};

  protected program: IProgram;

  protected ownedProgram?: IProgram;

  protected formatter: IFormatter;

  constructor(parameters: IDescriptionParameters) {
    this.program = parameters.program;
    this.ownedProgram = parameters.ownedProgram;
    this.formatter = parameters.formatter;
  }

  public renderEffect = () => {
    const actionCount = this.getActionCount();

    const minTime = this.program.calculateCompletionMinTime(actionCount);
    const maxTime = this.program.calculateCompletionMaxTime(actionCount);
    const minAvgValue = (actionCount / maxTime) * MS_IN_SECOND;
    const maxAvgValue = (actionCount / minTime) * MS_IN_SECOND;

    let minAvgValueDiff = minAvgValue;
    let maxAvgValueDiff = maxAvgValue;

    if (this.ownedProgram) {
      const ownedActionCount = this.getOwnedActionCount();

      const ownedMinTime = this.ownedProgram.calculateCompletionMinTime(ownedActionCount);
      const ownedMaxTime = this.ownedProgram.calculateCompletionMaxTime(ownedActionCount);
      const ownedMinAvgValue = (ownedActionCount / ownedMaxTime) * MS_IN_SECOND;
      const ownedMaxAvgValue = (ownedActionCount / ownedMinTime) * MS_IN_SECOND;

      minAvgValueDiff = minAvgValue - ownedMinAvgValue;
      maxAvgValueDiff = maxAvgValue - ownedMaxAvgValue;
    }

    const formattedActionCount = this.formatter.formatNumberDecimal(actionCount);
    const formattedMinAvgValue = this.formatter.formatNumberFloat(minAvgValue);
    const formattedMaxAvgValue = this.formatter.formatNumberFloat(maxAvgValue);

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
          PROGRAM_DESCRIPTION_TEXTS.actionCompletionDiffs(
            formattedActionCount,
            formattedMinAvgValue,
            minAvgDiffEl,
            formattedMaxAvgValue,
            maxAvgDiffEl,
          ),
        )}
      </p>
    `;
  };

  public recalculateValues() {}

  protected abstract getActionCount(): number;

  protected abstract getOwnedActionCount(): number;
}
