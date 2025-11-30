import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { msg, localized, str } from '@lit/localize';
import { consume } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS, CONTRACT_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { type IContract, ContractValidationResult } from '@state/activity-state';
import { AssignClonesContractDialogButtonsController } from './controller';
import { AssignClonesEvent, CancelEvent } from './events';
import { existingContractContext, temporaryContractContext } from '../../contexts';
import { AssignClonesContractDialogFormWarning, AssignClonesContractDialogWarning } from './types';
import styles from './styles';

@localized()
@customElement('ca-assign-clones-contract-dialog-buttons')
export class AssignClonesContractDialogButtons extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'disabled',
    type: Boolean,
  })
  disabled = false;

  private _controller: AssignClonesContractDialogButtonsController;

  @consume({ context: temporaryContractContext, subscribe: true })
  private _contract?: IContract;

  @consume({ context: existingContractContext, subscribe: true })
  private _existingContract?: IContract;

  constructor() {
    super();

    this._controller = new AssignClonesContractDialogButtonsController(this);
  }

  protected renderDesktop() {
    return html`
      ${this.renderWarning()}

      <div class="buttons">
        <sl-button size="medium" variant="default" @click=${this.handleCancel}> ${COMMON_TEXTS.close()} </sl-button>

        <sl-button size="medium" variant="primary" ?disabled=${this.disabled} @click=${this.handleAssignClones}>
          ${msg('Assign clones')}
        </sl-button>
      </div>
    `;
  }

  private selectWarning(): AssignClonesContractDialogWarning {
    if (!this._contract) {
      return AssignClonesContractDialogFormWarning.notSelected;
    }

    const validationResult = this._controller.validateContract(this._contract);

    if (validationResult === ContractValidationResult.valid && this._existingContract) {
      return AssignClonesContractDialogFormWarning.alreadyAssigned;
    }

    return validationResult;
  }

  private renderWarning = () => {
    const warning = this.selectWarning();
    let warningText = '';

    switch (warning) {
      case ContractValidationResult.activityLocked:
        warningText = msg('Contract is locked');
        break;
      case ContractValidationResult.districtLocked:
        warningText = msg('District is locked');
        break;
      case ContractValidationResult.notEnoughClones:
        warningText = msg('Not enough clones selected');
        break;
      case ContractValidationResult.tooManyClones:
        warningText = msg('Too many clones selected');
        break;
      case ContractValidationResult.requirementsNotMet:
        warningText = msg(`Clones don't fit requirements`);
        break;
      case AssignClonesContractDialogFormWarning.notSelected:
        warningText = msg('Select contract name, district and clones');
        break;
      case AssignClonesContractDialogFormWarning.alreadyAssigned:
        warningText = this.buildAlreadySelectedWarning();
        break;
      case ContractValidationResult.valid:
        return nothing;
    }

    return html` <p class="warning">${warningText}</p> `;
  };

  private buildAlreadySelectedWarning = () => {
    if (this._existingContract) {
      const contractName = CONTRACT_TEXTS[this._existingContract.contractName].title();
      const districtName = DISTRICT_NAMES[this._existingContract.district.name]();

      return msg(str`Contract "${contractName}" in district "${districtName}" is already assigned to other team`);
    }

    return '';
  };

  private handleCancel = () => {
    this.dispatchEvent(new CancelEvent());
  };

  private handleAssignClones = () => {
    this.dispatchEvent(new AssignClonesEvent());
  };
}
