import { html, PropertyValues } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { provide } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { BaseComponent, SidejobAlert } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { SIDEJOB_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { SidejobValidationResult, type ISidejob } from '@state/activity-state';
import { IClone } from '@state/clones-state';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { AssignCloneSidejobDialogCloseEvent } from './events';
import { AssignCloneSidejobDialogController } from './controller';
import { existingSidejobContext, temporarySidejobContext } from './contexts';
import styles from './styles';
import { AssignCloneSidejobDialogButtons } from './components/buttons/component';

@localized()
@customElement('ca-assign-clone-sidejob-dialog')
export class AssignCloneSidejobDialog extends BaseComponent {
  static styles = styles;

  hasMobileRender = true;
  hasPartialUpdate = true;

  private _controller: AssignCloneSidejobDialogController;

  private _cloneIdInputRef = createRef<SlSelect>();

  private _districtIndexInputRef = createRef<SlSelect>();

  private _sidejobNameInputRef = createRef<SlSelect>();

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _cloneId?: string;

  @state()
  private _districtIndex?: number;

  @state()
  private _sidejobName?: string;

  @provide({ context: temporarySidejobContext })
  private _sidejob?: ISidejob;

  @provide({ context: existingSidejobContext })
  private _existingSidejob?: ISidejob;

  private _buttonsRef = createRef<AssignCloneSidejobDialogButtons>();

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogController(this);
  }

  performUpdate() {
    if (this._sidejobName !== undefined && this._districtIndex !== undefined && this._cloneId !== undefined) {
      const sidejob = this._controller.getSidejob({
        assignedCloneId: this._cloneId,
        districtIndex: this._districtIndex,
        sidejobName: this._sidejobName,
      });

      this._sidejob = sidejob;
    } else {
      this._sidejob = undefined;
    }

    this._existingSidejob = this._controller.getExistingSidejobByClone(this._cloneId);

    super.performUpdate();
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._cloneId = undefined;
      this._districtIndex = undefined;
      this._sidejobName = undefined;
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

    return html`
      <form id="assign-clone-sidejob-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Assign clone to sidejob')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select clone, district and sidejob name to assign clone.
Clone can be assigned only to one sidejob.`)}
            </p>

            <div class=${inputsContainerClasses}>
              <sl-select
                ${ref(this._sidejobNameInputRef)}
                name="sidejobName"
                value=${this._sidejobName ?? ''}
                hoist
                @sl-change=${this.handleSidejobNameChange}
              >
                <span class="input-label" slot="label"> ${msg('Sidejob')} </span>

                ${this._controller.listAvailableSidejobs().map(this.renderSidejobName)}
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
                ${ref(this._cloneIdInputRef)}
                name="cloneId"
                value=${this._cloneId ?? ''}
                hoist
                @sl-change=${this.handleCloneIdChange}
              >
                <span class="input-label" slot="label"> ${msg('Clone')} </span>

                ${this._controller.listClones().map(this.renderCloneOption)}
              </sl-select>
            </div>
          </div>

          <ca-assign-clone-sidejob-dialog-description></ca-assign-clone-sidejob-dialog-description>

          <ca-assign-clone-sidejob-dialog-buttons
            ${ref(this._buttonsRef)}
            slot="footer"
            @assign-clone=${this.handleSubmit}
            @cancel=${this.handleClose}
          ></ca-assign-clone-sidejob-dialog-buttons>
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

  private renderSidejobName = (sidejobName: string) => {
    return html` <sl-option value=${sidejobName}> ${SIDEJOB_TEXTS[sidejobName].title()} </sl-option>`;
  };

  private handleClose = () => {
    this.dispatchEvent(new AssignCloneSidejobDialogCloseEvent());
  };

  private handleCloneIdChange = () => {
    if (!this._cloneIdInputRef.value) {
      return;
    }

    const cloneId = this._cloneIdInputRef.value.value as string;
    this._cloneId = cloneId;
  };

  private handleSidejobNameChange = () => {
    if (!this._sidejobNameInputRef.value) {
      return;
    }

    const sidejobName = this._sidejobNameInputRef.value.value as string;
    this._sidejobName = sidejobName;
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

    if (this._existingSidejob) {
      const cloneName = this._existingSidejob.assignedClone!.name;
      const existingSidejobName = SIDEJOB_TEXTS[this._existingSidejob.sidejobName].title();
      const districtName = DISTRICT_NAMES[this._existingSidejob.district.name]();

      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          SidejobAlert.replaceSidejob,
          msg(
            str`Are you sure want to replace sidejob for clone "${cloneName}"? This will cancel their current sidejob "${existingSidejobName}" in district "${districtName}".`,
          ),
          this.handleAssignClone,
        ),
      );
    } else {
      this.handleAssignClone();
    }
  };

  private handleAssignClone = () => {
    this._controller.assignClone({
      districtIndex: this._districtIndex!,
      sidejobName: this._sidejobName!,
      assignedCloneId: this._cloneId!,
    });

    this.dispatchEvent(new AssignCloneSidejobDialogCloseEvent());
  };

  handlePartialUpdate = () => {
    if (this._buttonsRef.value) {
      this._buttonsRef.value.disabled = !this.validate();
    }
  };

  private validate(): boolean {
    if (!this._sidejob) {
      return false;
    }

    return !!(this._sidejob && this._controller.validateSidejob(this._sidejob) === SidejobValidationResult.valid);
  }
}
