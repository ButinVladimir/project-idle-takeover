import { html } from 'lit';
import { IProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter, MS_IN_SECOND } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

export abstract class BaseAutomationProgramDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {};

  protected program: IProgram;

  protected formatter: IFormatter;

  constructor(parameters: IDescriptionParameters) {
    this.program = parameters.program;
    this.formatter = parameters.formatter;
  }

  public renderEffect = () => {
    const actionCount = this.getActionCount();
    const minTime = this.program.calculateCompletionMinTime(actionCount);
    const maxTime = this.program.calculateCompletionMaxTime(actionCount);
    const minAvgValue = (actionCount / maxTime) * MS_IN_SECOND;
    const maxAvgValue = (actionCount / minTime) * MS_IN_SECOND;

    const formattedActionCount = this.formatter.formatNumberDecimal(actionCount);
    const formattedMinAvgValue = this.formatter.formatNumberFloat(minAvgValue);
    const formattedMaxAvgValue = this.formatter.formatNumberFloat(maxAvgValue);

    return html`
      <p>
        ${COMMON_TEXTS.parameterRow(
          REWARD_PARAMETER_NAMES[RewardParameter.actions](),
          PROGRAM_DESCRIPTION_TEXTS.parameterCompletionValues(
            formattedActionCount,
            formattedMinAvgValue,
            formattedMaxAvgValue,
          ),
        )}
      </p>
    `;
  };

  public recalculateValues() {}

  protected abstract getActionCount(): number;
}
