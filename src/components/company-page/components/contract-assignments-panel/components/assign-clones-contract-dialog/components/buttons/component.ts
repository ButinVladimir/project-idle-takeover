import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { msg, localized, str } from '@lit/localize';
import { consume } from '@lit/context';
import { BaseComponent, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import { classMap } from 'lit/directives/class-map.js';
import { COMMON_TEXTS, CONTRACT_TEXTS, DISTRICT_NAMES, CONTRACT_VALIDATION_TEXTS, CONTRACTS_BATCH_VALIDATION_TEXTS } from '@texts/index';
import { type IContract, ContractsBatchValidationResult, ContractValidationResult } from '@state/activity-state';
import { AssignClonesContractDialogButtonsController } from './controller';
import { AssignClonesEvent, CancelEvent, RestoreValuesEvent } from './events';
import { existingContractContext, temporaryContractContext } from '../../contexts';
import { AssignClonesContractsDialogFormWarning, AssignClonesContractDialogWarning } from './types';
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

  @property({
    attribute: "contract-names",
    type: String
  })
  contractNames!: string;

    @property({
    attribute: "district-indexes",
    type: String
  })
  districtIndexes!: string;

    @property({
    attribute: "clone-ids",
    type: String
  })
  cloneIds!: string;

  // @consume({ context: temporaryContractContext, subscribe: true })
  // private _contract?: IContract;

  // @consume({ context: existingContractContext, subscribe: true })
  // private _existingContract?: IContract;

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
    if (!this.contractNames || !this.districtIndexes || !this.cloneIds) {
      return AssignClonesContractsDialogFormWarning.notSelected;
    }

    const contractNames = this.contractNames.split(MULTIPLE_SELECT_SEPARATOR);
    const districtIndexes = this.districtIndexes.split(MULTIPLE_SELECT_SEPARATOR).map((districtIndex) => parseInt(districtIndex));
    const cloneIds = this.cloneIds.split(MULTIPLE_SELECT_SEPARATOR);

    const validationResult = this._controller.validateContractsBatch(contractNames, districtIndexes, cloneIds);

    const existingAssignments = this._controller.getExistingContractAssignmentsByDistrictsAndContractNames(contractNames, districtIndexes);

    if (validationResult === ContractsBatchValidationResult.valid && existingAssignments.length > 0) {
      return AssignClonesContractsDialogFormWarning.alreadyAssigned;
    }

    return validationResult;
  }

  private renderWarning = () => {
    const warning = this.selectWarning();
    let warningText = '';

    switch (warning) {
      case ContractsBatchValidationResult.primaryActivityLocked:
      case ContractsBatchValidationResult.contractNotAvailable:
      case ContractsBatchValidationResult.districtsLocked:
      case ContractsBatchValidationResult.notEnoughClones:
      case ContractsBatchValidationResult.tooManyClones:
      case ContractsBatchValidationResult.requirementsNotMet:
        warningText = CONTRACTS_BATCH_VALIDATION_TEXTS[warning]();
        break;
      case AssignClonesContractsDialogFormWarning.notSelected:
        warningText = msg('Select contract names, districts and clones');
        break;
      case AssignClonesContractsDialogFormWarning.alreadyAssigned:
        warningText = msg('Some contracts are already assigned');
        break;
      case ContractsBatchValidationResult.valid:
        warningText = '';
        break;
    }

    const warningClasses = classMap({
      warning: true,
      visible: warning !== ContractsBatchValidationResult.valid,
    });

    return html` <p class=${warningClasses}>${warningText}</p> `;
  };

  private handleCancel = () => {
    this.dispatchEvent(new CancelEvent());
  };

  private handleAssignClones = () => {
    this.dispatchEvent(new AssignClonesEvent());
  };
}
