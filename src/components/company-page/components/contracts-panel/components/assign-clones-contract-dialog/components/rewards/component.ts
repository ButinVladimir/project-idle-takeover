import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, queryAll } from 'lit/decorators.js';
import {
  BaseComponent,
  diffFormatterParameters,
  DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES,
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
  getHighlightDifferenceClass,
} from '@shared/index';
import { type IContract } from '@state/activity-state';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { existingContractContext, temporaryContractContext } from '../../contexts';
import { DISPLAY_TYPES } from './constants';
import { AssignCloneSidejobDialogRewardsController } from './controller';
import styles from './styles';
import { IRewardValue } from './types';
import { checkContractParameterVisibility } from '../../../../helpers';

@localized()
@customElement('ca-assign-clones-contract-dialog-rewards')
export class AssignClonesContractDialogRewards extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: AssignCloneSidejobDialogRewardsController;

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.VALUE}]`)
  private _rewardValueElements!: NodeListOf<HTMLSpanElement>;

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.DIFF}]`)
  private _rewardDiffElements!: NodeListOf<HTMLSpanElement>;

  @consume({ context: temporaryContractContext, subscribe: true })
  private _contract?: IContract;

  @consume({ context: existingContractContext, subscribe: true })
  private _existingContract?: IContract;

  private _rewardValues: Record<DistrictTypeRewardParameter, IRewardValue> = Object.fromEntries(
    DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => [parameter, { value: 0, diff: 0 }]),
  ) as Record<DistrictTypeRewardParameter, IRewardValue>;

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogRewardsController(this);
  }

  protected renderDesktop() {
    if (!this._contract) {
      return nothing;
    }

    return html` ${DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => this.renderParameter(parameter))} `;
  }

  private renderParameter = (parameter: DistrictTypeRewardParameter) => {
    const parameterValues = DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES[parameter];

    if (!checkContractParameterVisibility(this._contract!, parameter)) {
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
    if (!this._contract) {
      return;
    }

    DISTRICT_TYPE_REWARD_PARAMETERS.forEach(this.updateParameter);

    this._rewardValueElements.forEach(this.updateValueElement);
    this._rewardDiffElements.forEach(this.updateDiffElement);
  };

  private updateParameter = (parameter: DistrictTypeRewardParameter) => {
    const newValue = this._contract!.calculateParameterDelta(parameter);
    const oldValue = this._existingContract ? this._existingContract!.calculateParameterDelta(parameter) : 0;

    this._rewardValues[parameter].value = newValue;
    this._rewardValues[parameter].diff = newValue - oldValue;
  };

  private updateValueElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const value = this._rewardValues[parameter].value;

    element.textContent = this._controller.formatter.formatNumberFloat(value);
  };

  private updateDiffElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const diff = this._rewardValues[parameter].diff;
    const className = getHighlightDifferenceClass(diff);

    element.textContent = this._controller.formatter.formatNumberFloat(diff, diffFormatterParameters);
    element.className = className;
  };
}
