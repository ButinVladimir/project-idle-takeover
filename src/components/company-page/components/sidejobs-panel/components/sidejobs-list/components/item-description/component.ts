import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, queryAll } from 'lit/decorators.js';
import {
  BaseComponent,
  DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES,
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
} from '@shared/index';
import { type ISidejobActivity } from '@state/activity-state';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { SidejobsListItemDescriptionController } from './controller';
import { sidejobActivityContext } from '../item/contexts';
import styles from './styles';
import { calculateSidejobParameterValue, checkSidejobParameterVisibility } from '../../../../helpers';

@localized()
@customElement('ca-sidejobs-list-item-description')
export class SidejobsListItemDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: SidejobsListItemDescriptionController;

  @queryAll(`span[data-value]`)
  private _rewardValueElements!: NodeListOf<HTMLSpanElement>;

  @consume({ context: sidejobActivityContext, subscribe: true })
  private _activity?: ISidejobActivity;

  private _rewardValues: Record<DistrictTypeRewardParameter, number> = Object.fromEntries(
    DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => [parameter, 0]),
  ) as Record<DistrictTypeRewardParameter, number>;

  constructor() {
    super();

    this._controller = new SidejobsListItemDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this._activity) {
      return nothing;
    }

    return html`
      <p class="overview">${SIDEJOB_TEXTS[this._activity.sidejob.sidejobName].overview()}</p>

      <p class="text">${msg('Rewards')}</p>

      ${DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => this.renderParameter(parameter))}
    `;
  }

  private renderParameter = (parameter: DistrictTypeRewardParameter) => {
    const parameterValues = DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES[parameter];

    if (!checkSidejobParameterVisibility(this._activity!.sidejob, parameter)) {
      return nothing;
    }

    if (!parameterValues.requirements.every((requirement) => this._controller.isFeatureUnlocked(requirement))) {
      return nothing;
    }

    const parameterName = REWARD_PARAMETER_NAMES[parameter]();
    const valueElement = html`<span data-value=${parameter}></span>`;

    const parameterText = parameterValues.isSpeed ? COMMON_TEXTS.parameterSpeed(valueElement) : valueElement;

    return html`<p class="text">${COMMON_TEXTS.parameterRow(parameterName, parameterText)}</p>`;
  };

  handlePartialUpdate = () => {
    if (!this._activity) {
      return;
    }

    DISTRICT_TYPE_REWARD_PARAMETERS.forEach(this.updateParameter);

    this._rewardValueElements.forEach(this.updateValueElement);
  };

  private updateParameter = (parameter: DistrictTypeRewardParameter) => {
    this._rewardValues[parameter] = calculateSidejobParameterValue(this._activity!.sidejob, parameter);
  };

  private updateValueElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as DistrictTypeRewardParameter;
    const value = this._rewardValues[parameter];

    element.textContent = this._controller.formatter.formatNumberFloat(value);
  };
}
