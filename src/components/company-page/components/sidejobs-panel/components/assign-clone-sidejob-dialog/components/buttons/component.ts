import isNil from 'lodash/isNil';
import { html } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { msg, localized } from '@lit/localize';
import { BaseComponent, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import { COMMON_TEXTS, SIDEJOBS_BATCH_VALIDATION_TEXTS } from '@texts/index';
import { SidejobsBatchValidationResult, type ISidejob } from '@state/activity-state';
import { AssignCloneSidejobDialogButtonsController } from './controller';
import { AssignCloneEvent, CancelEvent } from './events';
import { AssignCloneSidejobDialogFormWarning, AssignCloneSidejobDialogWarning } from './types';
import styles from './styles';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-buttons')
export class AssignCloneSidejobDialogButtons extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  @property({
    attribute: 'disabled',
    type: Boolean,
  })
  disabled = false;

  private _controller: AssignCloneSidejobDialogButtonsController;

  @property({
    attribute: 'sidejob-name',
    type: String,
  })
  sidejobName?: string;

  @property({
    attribute: 'district-index',
    type: Number,
  })
  districtIndex?: number;

  @property({
    attribute: 'clone-ids',
    type: String,
  })
  cloneIds!: string;

  @queryAll('p[data-warning]')
  private _warningElements!: NodeListOf<HTMLParagraphElement>;

  private _availableTimeRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogButtonsController(this);
  }

  protected renderDesktop() {
    return html`
      ${this.renderWarnings()}

      <div class="buttons">
        <sl-button size="medium" variant="default" @click=${this.handleCancel}> ${COMMON_TEXTS.close()} </sl-button>

        <sl-button size="medium" variant="primary" ?disabled=${this.disabled} @click=${this.handleAssignClone}>
          ${msg('Assign clones')}
        </sl-button>
      </div>
    `;
  }

  handlePartialUpdate = () => {
    const warning = this.selectWarning();

    this._warningElements.forEach((warningElement) => {
      if (warningElement.dataset.warning === warning) {
        warningElement.classList.add('visible');
      } else {
        warningElement.classList.remove('visible');
      }
    });

    this.updateAvailabilityTimer();
  };

  private renderWarnings = () => {
    return html`
      <p class="warning" data-warning=${SidejobsBatchValidationResult.companyLocked}>
        ${SIDEJOBS_BATCH_VALIDATION_TEXTS[SidejobsBatchValidationResult.companyLocked]()}
      </p>
      <p class="warning" data-warning=${SidejobsBatchValidationResult.sidejobsNotAvailable}>
        ${SIDEJOBS_BATCH_VALIDATION_TEXTS[SidejobsBatchValidationResult.sidejobsNotAvailable]()}
      </p>
      <p class="warning" data-warning=${SidejobsBatchValidationResult.districtsLocked}>
        ${SIDEJOBS_BATCH_VALIDATION_TEXTS[SidejobsBatchValidationResult.districtsLocked]()}
      </p>
      <p class="warning" data-warning=${SidejobsBatchValidationResult.requirementsNotMet}>
        ${SIDEJOBS_BATCH_VALIDATION_TEXTS[SidejobsBatchValidationResult.requirementsNotMet]()}
      </p>
      <p class="warning" data-warning=${SidejobsBatchValidationResult.notEnoughConnectivity}>
        ${SIDEJOBS_BATCH_VALIDATION_TEXTS[SidejobsBatchValidationResult.notEnoughConnectivity]()}
      </p>
      <p class="warning" data-warning=${AssignCloneSidejobDialogFormWarning.notSelected}>
        ${msg(`Select sidejob name, district and clones`)}
      </p>
      <p class="warning" data-warning=${AssignCloneSidejobDialogFormWarning.alreadyAssigned}>
        ${msg(`Some clones are already have assigned sidejobs`)}
      </p>
      <p class="warning" data-warning=${AssignCloneSidejobDialogFormWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
    `;
  };

  private selectWarning(): AssignCloneSidejobDialogWarning {
    if (isNil(this.sidejobName) || isNil(this.districtIndex) || !this.cloneIds) {
      return AssignCloneSidejobDialogFormWarning.notSelected;
    }

    const cloneIds = this.cloneIds.split(MULTIPLE_SELECT_SEPARATOR);

    const validationResult = this._controller.validateSidejobsBatch(this.sidejobName, this.districtIndex, cloneIds);
    const sidejobsWithAssignedClones = cloneIds
      .map((cloneId) => this._controller.getExistingSidejobByClone(cloneId))
      .filter((sidejob) => sidejob) as ISidejob[];

    if (validationResult === SidejobsBatchValidationResult.valid && sidejobsWithAssignedClones.length > 0) {
      return AssignCloneSidejobDialogFormWarning.alreadyAssigned;
    }

    return validationResult;
  }

  private updateAvailabilityTimer(): void {
    if (isNil(this.sidejobName) || isNil(this.districtIndex)) {
      return;
    }

    if (!this._availableTimeRef.value) {
      return;
    }

    const currentPoints = this._controller.getTotalConnectivity(this.districtIndex);
    const requiredPoints = this._controller.getRequiredConnectivity(this.sidejobName);
    const connectivityGrowth = this._controller.getConnectivityGrowth(this.districtIndex);
    const pointsDiff = requiredPoints - currentPoints;

    if (pointsDiff <= 0 || connectivityGrowth <= 0) {
      this._availableTimeRef.value.textContent = '';
    } else {
      const formattedTime = this._controller.formatter.formatTimeLong(pointsDiff / connectivityGrowth);
      this._availableTimeRef.value.textContent = formattedTime;
    }
  }

  private handleCancel = () => {
    this.dispatchEvent(new CancelEvent());
  };

  private handleAssignClone = () => {
    this.dispatchEvent(new AssignCloneEvent());
  };
}
