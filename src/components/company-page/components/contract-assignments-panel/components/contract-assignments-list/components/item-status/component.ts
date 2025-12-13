import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { ACTIVITY_UI_ACTIVITY_VALUES, ActivityUIActivityStatus, BaseComponent } from '@shared/index';
import { ContractValidationResult } from '@state/activity-state';
import { type IContractAssignment } from '@state/automation-state';
import { CONTRACT_VALIDATION_TEXTS } from '@texts/index';
import { ContractAssignmentsListItemStatusController } from './controller';
import { contractAssignmentActivityContext } from '../item/contexts';
import styles from './styles';
import { classMap } from 'lit/directives/class-map.js';

@localized()
@customElement('ca-contract-assignments-list-item-status')
export class ContractAssignmentsListItemStatus extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ContractAssignmentsListItemStatusController;

  @consume({ context: contractAssignmentActivityContext, subscribe: true })
  private _assignment?: IContractAssignment;

  constructor() {
    super();

    this._controller = new ContractAssignmentsListItemStatusController(this);
  }

  protected renderDesktop() {
    if (!this._assignment) {
      return nothing;
    }

    const validationResult = this._controller.validateContractAssignment(this._assignment);
    const status = this.getStatus(validationResult);
    const text = this.getText(status, validationResult);

    const { class: iconClass, icon } = ACTIVITY_UI_ACTIVITY_VALUES[status];

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
    const status = this.getStatus(validationResult);
    const text = this.getText(status, validationResult);

    const { class: textClass } = ACTIVITY_UI_ACTIVITY_VALUES[status];

    return html` <span class=${textClass}>${text}</span> `;
  }

  private getStatus(validationResult: ContractValidationResult): ActivityUIActivityStatus {
    if (this._controller.getContractActivity(this._assignment!)) {
      return ActivityUIActivityStatus.active;
    }

    if (validationResult !== ContractValidationResult.valid) {
      return ActivityUIActivityStatus.invalid;
    }

    if (this._controller.getAvailableCounters(this._assignment!) <= 0) {
      return ActivityUIActivityStatus.notAvailable;
    }

    return ActivityUIActivityStatus.valid;
  }

  private getText(status: ActivityUIActivityStatus, validationResult: ContractValidationResult): string {
    switch (status) {
      case ActivityUIActivityStatus.active:
        return msg('Contract assignment is active');
      case ActivityUIActivityStatus.valid:
        return msg('Contract assignment is valid');
      case ActivityUIActivityStatus.notAvailable:
        return msg('No contracts are available for this assignment');
      case ActivityUIActivityStatus.invalid:
        return CONTRACT_VALIDATION_TEXTS[validationResult]();
    }
  }
}
