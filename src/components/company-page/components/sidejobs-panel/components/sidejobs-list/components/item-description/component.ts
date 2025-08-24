import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, RewardParameter } from '@shared/index';
import { type ISidejob } from '@state/company-state';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { SidejobsListItemDescriptionController } from './controller';
import { sidejobContext } from '../item/contexts';
import styles from './styles';
import { SIDEJOB_PARAMETER_VALUES, SIDEJOB_PARAMETERS } from '../../../../constants';
import { calculateSidejobParameterValue, checkSidejobParameterVisibility } from '../../../../helpers';

@localized()
@customElement('ca-sidejobs-list-item-description')
export class SidejobsListItemDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: SidejobsListItemDescriptionController;

  @queryAll(`span[data-value]`)
  private _rewardValueElements!: NodeListOf<HTMLSpanElement>;

  @consume({ context: sidejobContext, subscribe: true })
  private _sidejob?: ISidejob;

  private _rewardValues: Record<RewardParameter, number> = Object.fromEntries(
    SIDEJOB_PARAMETERS.map((parameter) => [parameter, 0]),
  ) as Record<RewardParameter, number>;

  constructor() {
    super();

    this._controller = new SidejobsListItemDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this._sidejob) {
      return nothing;
    }

    return html`
      <p class="overview">${SIDEJOB_TEXTS[this._sidejob.sidejobName].overview()}</p>

      ${SIDEJOB_PARAMETERS.map((parameter) => this.renderParameter(parameter))}
    `;
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
    const valueElement = html`<span data-value=${parameter}></span>`;

    const parameterText = parameterValues.isSpeed ? COMMON_TEXTS.parameterSpeed(valueElement) : valueElement;

    return html`<p class="text">${COMMON_TEXTS.parameterValue(parameterName, parameterText)}</p>`;
  };

  handlePartialUpdate = () => {
    SIDEJOB_PARAMETERS.forEach(this.updateParameter);

    this._rewardValueElements.forEach(this.updateValueElement);
  };

  private updateParameter = (parameter: RewardParameter) => {
    this._rewardValues[parameter] = calculateSidejobParameterValue(this._sidejob!, parameter);
  };

  private updateValueElement = (element: HTMLSpanElement) => {
    const parameter = element.dataset.value as RewardParameter;
    const value = this._rewardValues[parameter];

    element.textContent = this._controller.formatter.formatNumberFloat(value);
  };
}
