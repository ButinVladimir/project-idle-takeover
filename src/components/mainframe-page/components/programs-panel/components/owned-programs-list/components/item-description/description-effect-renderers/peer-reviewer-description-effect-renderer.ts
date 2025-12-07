import { html } from 'lit';
import { PeerReviewerProgram } from '@state/mainframe-state/states';
import { IFormatter, RewardParameter } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

const VALUES = {
  experienceShareMultiplier: 'experienceShareMultiplier',
};

export class PeerReviewerDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {
    [VALUES.experienceShareMultiplier]: '',
  };

  private _program: PeerReviewerProgram;

  private _formatter: IFormatter;

  private _ram: number;

  private _cores: number;

  constructor(parameters: IDescriptionParameters) {
    this._program = parameters.program as PeerReviewerProgram;
    this._formatter = parameters.formatter;
    this._ram = parameters.ram;
    this._cores = parameters.cores;
  }

  public renderEffect = () => {
    return html`<p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[RewardParameter.experienceShareMultiplier](),
        PROGRAM_DESCRIPTION_TEXTS.upToValue(html`<span data-value=${VALUES.experienceShareMultiplier}></span>`),
      )}
    </p>`;
  };

  public recalculateValues() {
    const formattedValue = this._formatter.formatNumberFloat(
      this._program.calculateExperienceShareMultiplier(this._cores, this._ram),
    );

    this.values[VALUES.experienceShareMultiplier] = formattedValue;
  }
}
