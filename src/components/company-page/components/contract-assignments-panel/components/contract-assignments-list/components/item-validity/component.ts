import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { ACTIVITY_UI_VALIDITY_VALUES, ActivityUIValidity, BaseComponent } from '@shared/index';
import { ContractValidationResult } from '@state/activity-state';
import { type IContractAssignment } from '@state/automation-state';
import { ContractAssignmentsListItemValidityController } from './controller';
import { contractAssignmentActivityContext } from '../item/contexts';
import styles from './styles';
import { CONTRACT_VALIDATION_TEXTS } from '../../../../../../constants';
import { classMap } from 'lit/directives/class-map.js';

@localized()
@customElement('ca-contract-assignments-list-item-validity')
export class ContractAssignmentsListItemValidity extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ContractAssignmentsListItemValidityController;

  @consume({ context: contractAssignmentActivityContext, subscribe: true })
  private _assignment?: IContractAssignment;

  constructor() {
    super();

    this._controller = new ContractAssignmentsListItemValidityController(this);
  }

  protected renderDesktop() {
    if (!this._assignment) {
      return nothing;
    }

    const validationResult = this._controller.validateContractAssignment(this._assignment);
    const text = this.getText(validationResult);
    const validity =
      validationResult === ContractValidationResult.valid ? ActivityUIValidity.valid : ActivityUIValidity.invalid;

    const { class: iconClass, icon } = ACTIVITY_UI_VALIDITY_VALUES[validity];

    const iconClasses = classMap({
      desktop: true,
      'status-icon': true,
      [iconClass]: true,
    });

    return html`
      <sl-tooltip>
        <span slot="content"> ${text} </span>

        <sl-icon name=${icon} class=${iconClasses}> </sl-icon>
      </sl-tooltip>
    `;
  }

  protected renderMobile() {
    if (!this._assignment) {
      return nothing;
    }

    const validationResult = this._controller.validateContractAssignment(this._assignment);
    const text = this.getText(validationResult);
    const validity =
      validationResult === ContractValidationResult.valid ? ActivityUIValidity.valid : ActivityUIValidity.invalid;

    const { class: textClass } = ACTIVITY_UI_VALIDITY_VALUES[validity];

    return html` <span class=${textClass}>${text}</span> `;
  }

  private getText(validationResult: ContractValidationResult): string {
    if (validationResult === ContractValidationResult.valid) {
      return msg('Contract assignment is valid');
    }

    return CONTRACT_VALIDATION_TEXTS[validationResult]();
  }
}
