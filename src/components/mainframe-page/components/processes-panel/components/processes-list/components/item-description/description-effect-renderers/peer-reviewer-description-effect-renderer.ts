import { html } from 'lit';
import { IProcess, PeerReviewerProgram } from '@state/mainframe-state';
import { IFormatter, RewardParameter } from '@shared/index';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

export class PeerReviewerDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {};

  private _process: IProcess;

  private _formatter: IFormatter;

  private _availableRam: number;

  constructor(parameters: IDescriptionParameters) {
    this._process = parameters.process;
    this._formatter = parameters.formatter;
    this._availableRam = parameters.availableRam;
  }

  public renderEffect = () => {
    const { usedCores } = this._process;
    const program = this._process.program as PeerReviewerProgram;

    const formattedValue = this._formatter.formatNumberFloat(
      program.calculateExperienceShareMultiplier(usedCores, this._availableRam),
    );

    return html`<p>
      ${COMMON_TEXTS.parameterValue(
        REWARD_PARAMETER_NAMES[RewardParameter.experienceShareMultiplier](),
        formattedValue,
      )}
    </p>`;
  };

  public recalculateValues() {}
}
