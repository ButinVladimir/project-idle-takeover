import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, queryAll } from 'lit/decorators.js';
import {
  BaseComponent,
  diffFormatterParameters,
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
  getHighlightDifferenceClass,
  MS_IN_SECOND,
} from '@shared/index';
import { type IContract } from '@state/activity-state';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { existingContractContext, temporaryContractContext } from '../../contexts';
import { DISPLAY_TYPES } from './constants';
import { AssignCloneSidejobDialogRewardsController } from './controller';
import styles from './styles';
import { IRewardValue } from './types';

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

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.SPEED}]`)
  private _rewardSpeedElements!: NodeListOf<HTMLSpanElement>;

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.SPEED_DIFF}]`)
  private _rewardSpeedDiffElements!: NodeListOf<HTMLSpanElement>;

  @consume({ context: temporaryContractContext, subscribe: true })
  private _contract?: IContract;

  @consume({ context: existingContractContext, subscribe: true })
  private _existingContract?: IContract;

  private _rewardValues: Record<DistrictTypeRewardParameter, IRewardValue> = Object.fromEntries(
    DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => [parameter, { value: 0, diff: 0, speed: 0, speedDiff: 0 }]),
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
    if (!this._contract!.getParameterVisibility(parameter)) {
      return nothing;
    }

    const parameterName = REWARD_PARAMETER_NAMES[parameter]();
    const valueElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.VALUE}></span>`;
    const diffElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.DIFF}></span>`;
    const speedElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.SPEED}></span>`;
    const speedDiffElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.SPEED_DIFF}></span>`;

    const parameterText = COMMON_TEXTS.parameterCompletionSpeedDiff(
      valueElement,
      diffElement,
      speedElement,
      speedDiffElement,
    );

    return html`<p class="text">${COMMON_TEXTS.parameterRow(parameterName, parameterText)}</p>`;
  };

  handlePartialUpdate = () => {
    if (!this._contract) {
      return;
    }

    DISTRICT_TYPE_REWARD_PARAMETERS.forEach(this.updateParameter);

    this._rewardValueElements.forEach(this.updateValueElement);
    this._rewardDiffElements.forEach(this.updateDiffElement);
    this._rewardSpeedElements.forEach(this.updateSpeedElement);
    this._rewardSpeedDiffElements.forEach(this.updateSpeedDiffElement);
  };

  private updateParameter = (parameter: DistrictTypeRewardParameter) => {
    const newValue = this._contract!.calculateParameterDelta(parameter);
    const oldValue = this._existingContract?.calculateParameterDelta(parameter) ?? 0;

    const newSpeed = (newValue / this._contract!.completionTime) * MS_IN_SECOND;
    const oldSpeed = this._existingContract ? (oldValue / this._existingContract.completionTime) * MS_IN_SECOND : 0;

    this._rewardValues[parameter].value = newValue;
    this._rewardValues[parameter].diff = newValue - oldValue;
    this._rewardValues[parameter].speed = newSpeed;
    this._rewardValues[parameter].speedDiff = newSpeed - oldSpeed;
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

  private updateSpeedElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const speed = this._rewardValues[parameter].speed;

    element.textContent = this._controller.formatter.formatNumberFloat(speed);
  };

  private updateSpeedDiffElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const speedDiff = this._rewardValues[parameter].speedDiff;
    const className = getHighlightDifferenceClass(speedDiff);

    element.textContent = this._controller.formatter.formatNumberFloat(speedDiff, diffFormatterParameters);
    element.className = className;
  };
}
