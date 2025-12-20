import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, queryAll } from 'lit/decorators.js';
import {
  BaseComponent,
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
  MS_IN_SECOND,
} from '@shared/index';
import { type IContractAssignment } from '@state/automation-state';
import { COMMON_TEXTS, CONTRACT_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { ContractsAssignmentsListItemDescriptionController } from './controller';
import { contractAssignmentActivityContext } from '../item/contexts';
import styles from './styles';
import { DISPLAY_TYPES } from './constants';
import { IRewardValue } from './types';

@localized()
@customElement('ca-contracts-assignments-list-item-description')
export class ContractsAssignmentsListItemDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: ContractsAssignmentsListItemDescriptionController;

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.VALUE}]`)
  private _rewardValueElements!: NodeListOf<HTMLSpanElement>;

  @queryAll(`span[data-value][data-type=${DISPLAY_TYPES.SPEED}]`)
  private _rewardSpeedElements!: NodeListOf<HTMLSpanElement>;

  @consume({ context: contractAssignmentActivityContext, subscribe: true })
  private _assignment?: IContractAssignment;

  private _rewardValues: Record<DistrictTypeRewardParameter, IRewardValue> = Object.fromEntries(
    DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => [parameter, { value: 0, speed: 0 }]),
  ) as Record<DistrictTypeRewardParameter, IRewardValue>;

  constructor() {
    super();

    this._controller = new ContractsAssignmentsListItemDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this._assignment) {
      return nothing;
    }

    const formattedAvalailableCount = this._controller.formatter.formatNumberDecimal(
      this._controller.getAvailableCount(
        this._assignment.contract.district.index,
        this._assignment.contract.contractName,
      ),
    );
    const formattedCompletionTime = this._controller.formatter.formatTimeLong(this._assignment.contract.completionTime);

    return html`
      <p class="overview">${CONTRACT_TEXTS[this._assignment.contract.contractName].overview()}</p>

      <p class="text">${COMMON_TEXTS.parameterRow(msg('Available'), formattedAvalailableCount)}</p>

      <p class="text">${COMMON_TEXTS.parameterRow(COMMON_TEXTS.completionTime(), formattedCompletionTime)}</p>

      <p class="rewards">${msg('Projected rewards')}</p>

      ${DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => this.renderParameter(parameter))}
    `;
  }

  private renderParameter = (parameter: DistrictTypeRewardParameter) => {
    if (!this._assignment!.contract.getParameterVisibility(parameter)) {
      return nothing;
    }

    const parameterName = REWARD_PARAMETER_NAMES[parameter]();
    const valueElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.VALUE}></span>`;
    const speedElement = html`<span data-value=${parameter} data-type=${DISPLAY_TYPES.SPEED}></span>`;

    const parameterText = COMMON_TEXTS.parameterCompletionSpeed(valueElement, speedElement);

    return html`<p class="text">${COMMON_TEXTS.parameterRow(parameterName, parameterText)}</p>`;
  };

  handlePartialUpdate = () => {
    if (!this._assignment) {
      return;
    }

    DISTRICT_TYPE_REWARD_PARAMETERS.forEach(this.updateParameter);

    this._rewardValueElements.forEach(this.updateValueElement);
    this._rewardSpeedElements.forEach(this.updateSpeedElement);
  };

  private updateParameter = (parameter: DistrictTypeRewardParameter) => {
    const value = this._assignment!.contract.calculateParameterDelta(parameter);

    const speed = (value / this._assignment!.contract.completionTime) * MS_IN_SECOND;

    this._rewardValues[parameter].value = value;
    this._rewardValues[parameter].speed = speed;
  };

  private updateValueElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const value = this._rewardValues[parameter].value;

    element.textContent = this._controller.formatter.formatNumberFloat(value);
  };

  private updateSpeedElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const speed = this._rewardValues[parameter].speed;

    element.textContent = this._controller.formatter.formatNumberFloat(speed);
  };
}
