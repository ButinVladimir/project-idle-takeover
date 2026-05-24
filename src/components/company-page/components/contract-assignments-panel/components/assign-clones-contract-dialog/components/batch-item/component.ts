import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { ContractValidationResult, type IContract } from '@state/activity-state';
import { BaseComponent, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import { CONTRACT_TEXTS, CONTRACT_VALIDATION_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { AssignClonesContractDialogBatchItemController } from './controller';
import { existingContractContext, temporaryContractContext } from './contexts';
import styles from './styles';
import { AssignClonesContractDialogBatchItemFormWarning, AssignClonesContractDialogBatchItemWarning } from './types';

@localized()
@customElement('ca-assign-clones-contract-dialog-batch-item')
export class AssignClonesContractDialogBatchItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'contract-name',
    type: String,
  })
  contractName!: string;

  @property({
    attribute: 'district-index',
    type: Number,
  })
  districtIndex!: number;

  @property({
    attribute: 'clone-ids',
    type: String,
  })
  cloneIds!: string;

  private _controller: AssignClonesContractDialogBatchItemController;

  @provide({ context: temporaryContractContext })
  private _contract?: IContract;

  @provide({ context: existingContractContext })
  private _existingContract?: IContract;

  constructor() {
    super();

    this._controller = new AssignClonesContractDialogBatchItemController(this);
  }

  protected renderDesktop() {
    if (!this._contract) {
      return nothing;
    }

    const contractTitle = CONTRACT_TEXTS[this._contract.contractName].title();
    const districtName = DISTRICT_NAMES[this._contract.district.name]();

    return html`
      <sl-details>
        <div slot="summary">
          <h5 class="title">${msg(str`Contract "${contractTitle}" in district "${districtName}"`)}</h5>

          <p class="warning">${this.renderWarning()}</p>
        </div>

        <article>
          <ca-assign-clones-contract-dialog-item-description></ca-assign-clones-contract-dialog-item-description>
        </article>
      </sl-details>
    `;
  }

  protected updateContext() {
    if (this.contractName !== undefined && this.districtIndex !== undefined) {
      const contract = this._controller.makeContract({
        assignedCloneIds: this.getCloneIds(),
        districtIndex: this.districtIndex,
        contractName: this.contractName,
      });

      this._contract = contract;
      this._existingContract = this._controller.getExistingContractAssignment(
        this.contractName,
        this.districtIndex,
      )?.contract;
    } else {
      this._contract = undefined;
      this._existingContract = undefined;
    }
  }

  private renderWarning = () => {
    if (!this._contract) {
      return nothing;
    }

    const warning = this.selectWarning();

    switch (warning) {
      case ContractValidationResult.primaryActivityLocked:
      case ContractValidationResult.districtLocked:
      case ContractValidationResult.contractNotAvailable:
      case ContractValidationResult.notEnoughClones:
      case ContractValidationResult.tooManyClones:
      case ContractValidationResult.requirementsNotMet:
        return CONTRACT_VALIDATION_TEXTS[warning]();
      case AssignClonesContractDialogBatchItemFormWarning.alreadyAssigned:
        return this.makeAlreadyAssignedWarning();
      default:
        return nothing;
    }
  };

  private selectWarning(): AssignClonesContractDialogBatchItemWarning {
    const validationResult = this._controller.validateContract(
      this.contractName,
      this.districtIndex,
      this.getCloneIds(),
    );

    if (validationResult !== ContractValidationResult.valid) {
      return validationResult;
    }

    if (this._existingContract) {
      return AssignClonesContractDialogBatchItemFormWarning.alreadyAssigned;
    }

    return ContractValidationResult.valid;
  }

  private makeAlreadyAssignedWarning() {
    if (!this._existingContract) {
      return nothing;
    }

    const clones = this._existingContract.assignedClones.map((clone) => `"${clone.name}"`);

    return msg(str`Contract is already assigned to clones ${clones.join(', ')}`);
  }

  private getCloneIds(): string[] {
    return this.cloneIds ? this.cloneIds.split(MULTIPLE_SELECT_SEPARATOR) : [];
  }
}
