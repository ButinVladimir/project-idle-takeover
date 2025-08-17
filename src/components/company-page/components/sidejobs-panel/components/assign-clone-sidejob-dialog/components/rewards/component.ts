import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, diffFormatterParameters, getHighlightDifferenceClass, RewardParameter } from '@shared/index';
import { type ISidejob } from '@state/company-state';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { existingSidejobContext, temporarySidejobContext } from '../../contexts';
import { DISPLAY_TYPES } from './constants';
import { AssignCloneSidejobDialogRewardsController } from './controller';
import styles from './styles';
import { SIDEJOB_PARAMETER_VALUES, SIDEJOB_PARAMETERS } from '../../../../constants';
import { IRewardValue } from './types';
import { calculateSidejobParameterValue, checkSidejobParameterVisibility } from '../../../../helpers';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-rewards')
export class AssignCloneSidejobDialogRewards extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: AssignCloneSidejobDialogRewardsController;

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.VALUE}]`)
  private _rewardValueElements!: NodeListOf<HTMLSpanElement>;

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.DIFF}]`)
  private _rewardDiffElements!: NodeListOf<HTMLSpanElement>;

  @consume({ context: temporarySidejobContext, subscribe: true })
  private _sidejob?: ISidejob;

  @consume({ context: existingSidejobContext, subscribe: true })
  private _existingSidejob?: ISidejob;

  private _rewardValues: Record<RewardParameter, IRewardValue> = Object.fromEntries(
    SIDEJOB_PARAMETERS.map((parameter) => [parameter, { value: 0, diff: 0 }]),
  ) as Record<RewardParameter, IRewardValue>;

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogRewardsController(this);
  }

  protected renderDesktop() {
    if (!this._sidejob) {
      return nothing;
    }

    return html` ${SIDEJOB_PARAMETERS.map((parameter) => this.renderParameter(parameter))} `;
  }

  private renderParameter = (parameter: RewardParameter) => {
    const parameterValues = SIDEJOB_PARAMETER_VALUES[parameter];

    if (!checkSidejobParameterVisibility(this._sidejob!, parameter)) {
      return nothing;
    }

    if (!parameterValues.requirements.every((requirement) => this._controller.isFeatureUnlocked(requirement))) {
      return nothing;
    }

    const parameterName = REWARD_PARAMETER_NAMES[parameter]();
    const valueElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.VALUE}></span>`;
    const diffElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.DIFF}></span>`;

    const parameterText = parameterValues.isSpeed
      ? COMMON_TEXTS.parameterSpeedDiff(valueElement, diffElement)
      : COMMON_TEXTS.parameterDiff(valueElement, diffElement);

    return html`<p class="text">${COMMON_TEXTS.parameterValue(parameterName, parameterText)}</p>`;
  };

  handlePartialUpdate = () => {
    if (!this._sidejob) {
      return;
    }

    SIDEJOB_PARAMETERS.forEach(this.updateParameter);

    this._rewardValueElements.forEach(this.updateValueElement);
    this._rewardDiffElements.forEach(this.updateDiffElement);
  };

  private updateParameter = (parameter: RewardParameter) => {
    const newValue = calculateSidejobParameterValue(this._sidejob!, parameter);
    const oldValue = this._existingSidejob ? calculateSidejobParameterValue(this._existingSidejob, parameter) : 0;

    this._rewardValues[parameter].value = newValue;
    this._rewardValues[parameter].diff = newValue - oldValue;
  };

  private updateValueElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as RewardParameter;
    const value = this._rewardValues[parameter].value;

    element.textContent = this._controller.formatter.formatNumberFloat(value);
  };

  private updateDiffElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as RewardParameter;
    const diff = this._rewardValues[parameter].diff;
    const className = getHighlightDifferenceClass(diff);

    element.textContent = this._controller.formatter.formatNumberFloat(diff, diffFormatterParameters);
    element.className = className;
  };
}
