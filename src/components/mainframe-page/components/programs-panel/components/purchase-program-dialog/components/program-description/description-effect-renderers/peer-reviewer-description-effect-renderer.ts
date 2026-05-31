import { html } from 'lit';
import { PeerReviewerProgram } from '@state/mainframe-state';
import { RewardParameter, IFormatter, diffFormatterParameters, getHighlightDifferenceClass } from '@shared/index';
import { COMMON_TEXTS, PROGRAM_DESCRIPTION_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { IDescriptionParameters, IDescriptionEffectRenderer } from '../interfaces';

const VALUES = {
  experienceShareMultiplier: 'experienceShareMultiplier',
};

export class PeerReviewerDescriptionEffectRenderer implements IDescriptionEffectRenderer {
  public readonly values = {
    [VALUES.experienceShareMultiplier]: '',
  };
  public readonly diffs = {
    [VALUES.experienceShareMultiplier]: { value: '', className: '' },
  };

  private _program: PeerReviewerProgram;

  private _ownedProgram?: PeerReviewerProgram;

  private _formatter: IFormatter;

  private _ram: number;

  private _cores: number;

  constructor(parameters: IDescriptionParameters) {
    this._program = parameters.program as PeerReviewerProgram;
    this._ownedProgram = parameters.ownedProgram as PeerReviewerProgram;
    this._formatter = parameters.formatter;
    this._ram = parameters.ram;
    this._cores = parameters.cores;
  }

  public renderEffect = () => {
    return html`<p>
      ${COMMON_TEXTS.parameterRow(
        REWARD_PARAMETER_NAMES[RewardParameter.experienceShareMultiplier](),
        PROGRAM_DESCRIPTION_TEXTS.upToDiff(
          html`<span data-value=${VALUES.experienceShareMultiplier}></span>`,
          html`<span data-diff=${VALUES.experienceShareMultiplier}></span>`,
        ),
      )}
    </p>`;
  };

  public recalculateValues(): void {
    const value = this._program.calculateExperienceShareMultiplier(this._cores, this._ram);
    const valueDiff = this._ownedProgram
      ? value - this._ownedProgram.calculateExperienceShareMultiplier(this._cores, this._ram)
      : value;

    const formattedValue = this._formatter.formatNumberFloat(value);
    const formattedDiff = this._formatter.formatNumberFloat(valueDiff, diffFormatterParameters);

    this.values[VALUES.experienceShareMultiplier] = formattedValue;
    this.diffs[VALUES.experienceShareMultiplier].className = getHighlightDifferenceClass(valueDiff);
    this.diffs[VALUES.experienceShareMultiplier].value = formattedDiff;
  }
}
