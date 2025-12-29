import { html, PropertyValues } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { provide } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { BaseComponent, ContractAlert } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { DISTRICT_NAMES, CONTRACT_TEXTS } from '@texts/index';
import { type IContract, ContractValidationResult } from '@state/activity-state';
import { IClone } from '@state/clones-state';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events/confirmation-alert-open';
import { AssignClonesContractDialogCloseEvent } from './events';
import { AssignClonesContractDialogController } from './controller';
import { existingContractContext as contractName, temporaryContractContext } from './contexts';
import styles from './styles';

@localized()
@customElement('ca-assign-clones-contract-dialog')
export class AssignClonesContractDialog extends BaseComponent {
  static styles = styles;

  hasMobileRender = true;

  private _controller: AssignClonesContractDialogController;

  private _clonesIdInputRef = createRef<SlSelect>();

  private _districtIndexInputRef = createRef<SlSelect>();

  private _contractNameInputRef = createRef<SlSelect>();

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _cloneIds: string[] = [];

  @state()
  private _districtIndex?: number;

  @state()
  private _contractName?: string;

  @provide({ context: temporaryContractContext })
  private _contract?: IContract;

  @provide({ context: contractName })
  private _existingContract?: IContract;

  constructor() {
    super();

    this._controller = new AssignClonesContractDialogController(this);
  }

  performUpdate() {
    if (this._contractName !== undefined && this._districtIndex !== undefined) {
      const contract = this._controller.getContract({
        assignedCloneIds: this._cloneIds,
        districtIndex: this._districtIndex,
        contractName: this._contractName,
      });

      this._contract = contract;
    } else {
      this._contract = undefined;
    }

    this._existingContract =
      this._districtIndex !== undefined && this._contractName !== undefined
        ? this._controller.getExistingContractByDistrictAndContract(this._districtIndex, this._contractName)
        : undefined;

    super.performUpdate();
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._cloneIds = [];
      this._districtIndex = undefined;
      this._contractName = undefined;
    }
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    const inputsContainerClasses = classMap({
      'inputs-container': true,
      desktop: desktop,
      mobile: !desktop,
    });

    const contractValid = this.validate();

    return html`
      <form id="assign-clone-sidejob-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Assign clones to contract')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select clones, district and contract name to assign clones.
Only one team of clones can be assigned per district and contract.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-select
                ${ref(this._contractNameInputRef)}
                name="contractName"
                value=${this._contractName ?? ''}
                hoist
                @sl-change=${this.handleContractNameChange}
              >
                <span class="input-label" slot="label"> ${msg('Contract')} </span>

                ${this._controller.listAvailableContracts().map(this.renderContractName)}
              </sl-select>

              <sl-select
                ${ref(this._districtIndexInputRef)}
                name="districtIndex"
                value=${this._districtIndex ?? ''}
                hoist
                @sl-change=${this.handleDistrictIndexChange}
              >
                <span class="input-label" slot="label"> ${msg('District')} </span>

                ${this._controller.listAvailableDistricts().map(this.renderDistrictOption)}
              </sl-select>

              <sl-select
                ${ref(this._clonesIdInputRef)}
                name="cloneId"
                value=${this._cloneIds.join(' ')}
                multiple
                clearable
                hoist
                @sl-change=${this.handleCloneIdsChange}
              >
                <span class="input-label" slot="label"> ${msg('Clones')} </span>

                ${this._controller.listClones().map(this.renderCloneOption)}
              </sl-select>
            </div>

            <ca-assign-clones-contract-dialog-description></ca-assign-clones-contract-dialog-description>
          </div>

          <ca-assign-clones-contract-dialog-buttons
            ?disabled=${!contractValid}
            slot="footer"
            @assign-clones=${this.handleSubmit}
            @cancel=${this.handleClose}
          ></ca-assign-clones-contract-dialog-buttons>
        </sl-dialog>
      </form>
    `;
  }

  private renderCloneOption = (clone: IClone) => {
    return html`<sl-option value=${clone.id}> ${clone.name} </sl-option>`;
  };

  private renderDistrictOption = (districtState: IDistrictState) => {
    return html`<sl-option value=${districtState.index}> ${DISTRICT_NAMES[districtState.name]()} </sl-option>`;
  };

  private renderContractName = (contractName: string) => {
    return html` <sl-option value=${contractName}> ${CONTRACT_TEXTS[contractName].title()} </sl-option>`;
  };

  private handleClose = () => {
    this.dispatchEvent(new AssignClonesContractDialogCloseEvent());
  };

  private handleCloneIdsChange = () => {
    if (!this._clonesIdInputRef.value) {
      return;
    }

    const cloneIds = this._clonesIdInputRef.value.value as string[];
    this._cloneIds = cloneIds;
  };

  private handleContractNameChange = () => {
    if (!this._contractNameInputRef.value) {
      return;
    }

    const contractName = this._contractNameInputRef.value.value as string;
    this._contractName = contractName;
  };

  private handleDistrictIndexChange = () => {
    if (!this._districtIndexInputRef.value) {
      return;
    }

    const districtIndex = parseInt(this._districtIndexInputRef.value.value as string);
    this._districtIndex = districtIndex;
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.validate()) {
      return;
    }

    if (this._existingContract) {
      const contractName = CONTRACT_TEXTS[this._existingContract.contractName].title();
      const districtName = DISTRICT_NAMES[this._existingContract.district.name]();

      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          ContractAlert.replaceContractAssignment,
          msg(
            str`Are you sure want to replace contract assignment for contract "${contractName}" in district "${districtName}"? All contracts in progress won't be affected.`,
          ),
          this.handleAssignClones,
        ),
      );
    } else {
      this.handleAssignClones();
    }
  };

  private handleAssignClones = () => {
    this._controller.assignClones({
      districtIndex: this._districtIndex!,
      contractName: this._contractName!,
      assignedCloneIds: this._cloneIds,
    });

    this.dispatchEvent(new AssignClonesContractDialogCloseEvent());
  };

  private validate(): boolean {
    if (!this._contract) {
      return false;
    }

    return !!(this._contract && this._controller.validateContract(this._contract) === ContractValidationResult.valid);
  }
}
