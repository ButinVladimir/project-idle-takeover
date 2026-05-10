import { html, PropertyValues } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { BaseComponent, compareOptions, ISelectOption, MULTIPLE_SELECT_SEPARATOR, SidejobAlert } from '@shared/index';
import { SIDEJOB_TEXTS, DISTRICT_NAMES } from '@texts/index';
import { type ISidejob } from '@state/activity-state';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { AssignCloneSidejobDialogCloseEvent } from './events';
import { AssignCloneSidejobDialogController } from './controller';
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
  private _sidejobName?: string;

  @state()
  private _districtIndex?: number;

  @state()
  private _cloneIds: string[] = [];

  private _buttonsRef = createRef<AssignCloneSidejobDialogButtons>();

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogController(this);
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open')) {
      this._cloneIds = [];
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
          <h4 slot="label" class="title">${msg('Assign clones to sidejob')}</h4>

          <div class="body">
            <p class="hint">
              ${msg(`Select sidejob name, district and clones to assign clones.
Each clone can be assigned only to one sidejob at same time.`)}
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

                ${this.renderSidejobNameOptions()}
              </sl-select>

              <sl-select
                ${ref(this._districtIndexInputRef)}
                name="districtIndex"
                value=${this._districtIndex !== undefined ? this._districtIndex : ''}
                hoist
                @sl-change=${this.handleDistrictIndexChange}
              >
                <span class="input-label" slot="label"> ${msg('District')} </span>

                ${this.renderDistrictOptions()}
              </sl-select>

              <sl-select
                ${ref(this._cloneIdInputRef)}
                name="cloneId"
                value=${this._cloneIds.join(MULTIPLE_SELECT_SEPARATOR)}
                multiple
                clearable
                hoist
                @sl-change=${this.handleCloneIdsChange}
              >
                <span class="input-label" slot="label"> ${msg('Clones')} </span>

                ${this.renderCloneOptions()}
              </sl-select>
            </div>

            <ca-assign-clone-sidejob-dialog-batch-description
              sidejob-name=${ifDefined(this._sidejobName)}
              district-index=${ifDefined(this._districtIndex)}
              clone-ids=${this._cloneIds.join(MULTIPLE_SELECT_SEPARATOR)}
            ></ca-assign-clone-sidejob-dialog-batch-description>
          </div>

          <ca-assign-clone-sidejob-dialog-buttons
            ${ref(this._buttonsRef)}
            slot="footer"
            sidejob-name=${ifDefined(this._sidejobName)}
            district-index=${ifDefined(this._districtIndex)}
            clone-ids=${this._cloneIds.join(MULTIPLE_SELECT_SEPARATOR)}
            @assign-clone=${this.handleSubmit}
            @cancel=${this.handleClose}
          ></ca-assign-clone-sidejob-dialog-buttons>
        </sl-dialog>
      </form>
    `;
  }

  private renderCloneOptions = () => {
    const clones = this._controller.listClones();
    const cloneOptions: ISelectOption[] = clones.map((clone) => ({
      value: clone.id,
      name: clone.name,
    }));
    cloneOptions.sort(compareOptions);

    return cloneOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderDistrictOptions = () => {
    const districts = this._controller.listAvailableDistricts();
    const districtOptions: ISelectOption[] = districts.map((district) => ({
      value: district.index.toString(),
      name: DISTRICT_NAMES[district.name](),
    }));
    districtOptions.sort(compareOptions);

    return districtOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  private renderSidejobNameOptions = () => {
    const sidejobNames = this._controller.listAvailableSidejobs();
    const sidejobNameOptions: ISelectOption[] = sidejobNames.map((sidejobName) => ({
      value: sidejobName,
      name: SIDEJOB_TEXTS[sidejobName].title(),
    }));
    sidejobNameOptions.sort(compareOptions);

    return sidejobNameOptions.map(({ name, value }) => html`<sl-option value=${value}>${name}</sl-option>`);
  };

  // protected updateContext() {
  //   if (this._sidejobName !== undefined && this._districtIndex !== undefined && this._cloneId !== undefined) {
  //     const sidejob = this._controller.makeSidejob({
  //       assignedCloneId: this._cloneId,
  //       districtIndex: this._districtIndex,
  //       sidejobName: this._sidejobName,
  //     });

  //     this._sidejob = sidejob;
  //   } else {
  //     this._sidejob = undefined;
  //   }

  //   if (this._cloneId) {
  //     this._existingSidejob = this._controller.getExistingSidejobByClone(this._cloneId);
  //   }
  // }

  private handleClose = () => {
    this.dispatchEvent(new AssignCloneSidejobDialogCloseEvent());
  };

  private handleCloneIdsChange = () => {
    if (!this._cloneIdInputRef.value) {
      return;
    }

    const cloneIds = this._cloneIdInputRef.value.value as string[];
    this._cloneIds = cloneIds;
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

    const sidejobsWithAssignedClones = this._cloneIds
      .map((cloneId) => this._controller.getExistingSidejobByClone(cloneId))
      .filter((sidejob) => sidejob) as ISidejob[];

    if (sidejobsWithAssignedClones.length > 0) {
      const cloneNames = sidejobsWithAssignedClones.map((sidejob) => `"${sidejob.assignedClone.name}"`).join(', ');

      this.dispatchEvent(
        new ConfirmationAlertOpenEvent(
          SidejobAlert.replaceSidejob,
          msg(
            str`Are you sure want to replace sidejob for clones ${cloneNames}? This will cancel their current sidejobs.`,
          ),
          this.handleAssignClones,
        ),
      );
    } else {
      this.handleAssignClones();
    }
  };

  private handleAssignClones = () => {
    this._controller.assignSidejobsBatch(this._sidejobName!, this._districtIndex!, this._cloneIds);

    this.dispatchEvent(new AssignCloneSidejobDialogCloseEvent());
  };

  handlePartialUpdate = () => {
    if (this._buttonsRef.value) {
      this._buttonsRef.value.disabled = !this.validate();
    }
  };

  private validate(): boolean {
    if (this._sidejobName === undefined || this._districtIndex === undefined || this._cloneIds.length === 0) {
      return false;
    }

    return this._controller.validateSidejobsBatch(this._sidejobName, this._districtIndex, this._cloneIds);
  }
}
