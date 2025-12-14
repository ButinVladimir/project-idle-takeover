import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import {
  BaseComponent,
  DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES,
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
} from '@shared/index';
import { type IPrimaryActivity } from '@state/activity-state';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES } from '@texts/index';
import { PrimaryActivityQueueListItemDescriptionController } from './controller';
import { primaryActivityContext } from '../list-item/contexts';
import styles from './styles';

@localized()
@customElement('ca-primary-activity-queue-list-item-rewards')
export class PrimaryActivityQueueListItemDescription extends BaseComponent {
  static styles = styles;

  @consume({ context: primaryActivityContext, subscribe: true })
  private _primaryActivity?: IPrimaryActivity;

  private _controller: PrimaryActivityQueueListItemDescriptionController;

  constructor() {
    super();

    this._controller = new PrimaryActivityQueueListItemDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this._primaryActivity) {
      return nothing;
    }

    return html`
      <p class="rewards">${msg('Rewards for completion')}</p>

      ${DISTRICT_TYPE_REWARD_PARAMETERS.map((parameter) => this.renderParameter(parameter))}
    `;
  }

  private renderParameter = (parameter: DistrictTypeRewardParameter) => {
    const parameterValues = DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES[parameter];

    const value = this._primaryActivity?.getParameterReward(parameter);

    if (value === undefined) {
      return nothing;
    }

    if (!parameterValues.requirements.every((requirement) => this._controller.isFeatureUnlocked(requirement))) {
      return nothing;
    }

    const parameterName = REWARD_PARAMETER_NAMES[parameter]();

    const formatter = this._controller.formatter;
    const formattedValue = formatter.formatNumberFloat(value);

    return html`<p class="text">${COMMON_TEXTS.parameterRow(parameterName, formattedValue)}</p>`;
  };
}
