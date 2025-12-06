import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, queryAll } from 'lit/decorators.js';
import {
  BaseComponent,
  DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES,
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
} from '@shared/index';
import { type IContractAssignment } from '@state/automation-state';
import { COMMON_TEXTS, CONTRACT_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { ContractsAssignmentsListItemDescriptionController } from './controller';
import { contractAssignmentActivityContext } from '../item/contexts';
import styles from './styles';
import { checkContractParameterVisibility } from '../../../../helpers';

@localized()
@customElement('ca-contracts-assignments-list-item-description')
export class ContractsAssignmentsListItemDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: ContractsAssignmentsListItemDescriptionController;

  @queryAll(`span[data-value]`)
  private _rewardValueElements!: NodeListOf<HTMLSpanElement>;

  @consume({ context: contractAssignmentActivityContext, subscribe: true })
  private _assignment?: IContractAssignment;

  private _rewardValues: Record<DistrictTypeRewardParameter, number> = Object.fromEntries(
    DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => [parameter, 0]),
  ) as Record<DistrictTypeRewardParameter, number>;

  constructor() {
    super();

    this._controller = new ContractsAssignmentsListItemDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this._assignment) {
      return nothing;
    }

    return html`
      <p class="overview">${CONTRACT_TEXTS[this._assignment.contract.contractName].overview()}</p>

      ${DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => this.renderParameter(parameter))}
    `;
  }

  private renderParameter = (parameter: DistrictTypeRewardParameter) => {
    const parameterValues = DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES[parameter];

    if (!checkContractParameterVisibility(this._assignment!.contract, parameter)) {
      return nothing;
    }

    if (!parameterValues.requirements.every((requirement) => this._controller.isFeatureUnlocked(requirement))) {
      return nothing;
    }

    const parameterName = REWARD_PARAMETER_NAMES[parameter]();
    const valueElement = html`<span data-value=${parameter}></span>`;

    const parameterText = parameterValues.isSpeed ? COMMON_TEXTS.parameterSpeed(valueElement) : valueElement;

    return html`<p class="text">${COMMON_TEXTS.parameterValue(parameterName, parameterText)}</p>`;
  };

  handlePartialUpdate = () => {
    if (!this._assignment) {
      return;
    }

    DISTRICT_TYPE_REWARD_PARAMETERS.forEach(this.updateParameter);

    this._rewardValueElements.forEach(this.updateValueElement);
  };

  private updateParameter = (parameter: DistrictTypeRewardParameter) => {
    this._rewardValues[parameter] = this._assignment!.contract.calculateParameterDelta(parameter);
  };

  private updateValueElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const value = this._rewardValues[parameter];

    element.textContent = this._controller.formatter.formatNumberFloat(value);
  };
}
