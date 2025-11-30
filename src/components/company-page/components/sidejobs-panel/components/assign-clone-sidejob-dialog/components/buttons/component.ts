import { html } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { msg, localized, str } from '@lit/localize';
import { consume } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS, DISTRICT_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { SidejobValidationResult, type ISidejob } from '@state/activity-state';
import { AssignCloneSidejobDialogButtonsController } from './controller';
import { AssignCloneEvent, CancelEvent } from './events';
import { existingSidejobContext, temporarySidejobContext } from '../../contexts';
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

  @consume({ context: temporarySidejobContext, subscribe: true })
  private _sidejob?: ISidejob;

  @consume({ context: existingSidejobContext, subscribe: true })
  private _existingSidejob?: ISidejob;

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
          ${msg('Assign clone')}
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
      <p class="warning" data-warning=${SidejobValidationResult.activityLocked}>${msg('Sidejob is locked')}</p>
      <p class="warning" data-warning=${SidejobValidationResult.districtLocked}>${msg('District is locked')}</p>
      <p class="warning" data-warning=${SidejobValidationResult.requirementsNotMet}>
        ${msg(`Clone doesn't fit requirements`)}
      </p>
      <p class="warning" data-warning=${SidejobValidationResult.notEnoughConnectivity}>
        ${msg(`Not enough connectivity`)}
      </p>
      <p class="warning" data-warning=${AssignCloneSidejobDialogFormWarning.notSelected}>
        ${msg(`Select sidejob name, district and clone`)}
      </p>
      <p class="warning" data-warning=${AssignCloneSidejobDialogFormWarning.willBeAvailableIn}>
        ${COMMON_TEXTS.willBeAvailableIn(html`<span ${ref(this._availableTimeRef)}></span>`)}
      </p>
      ${this.renderAlreadySelectedWarning()}
    `;
  };

  private renderAlreadySelectedWarning = () => {
    if (this._existingSidejob) {
      const sidejobName = SIDEJOB_TEXTS[this._existingSidejob.sidejobName].title();
      const districtName = DISTRICT_NAMES[this._existingSidejob.district.name]();

      return html`
        <p class="warning" data-warning=${AssignCloneSidejobDialogFormWarning.alreadyAssigned}>
          ${msg(str`Clone has already assigned sidejob "${sidejobName}" in district "${districtName}"`)}
        </p>
      `;
    }
  };

  private selectWarning(): AssignCloneSidejobDialogWarning {
    if (!this._sidejob) {
      return AssignCloneSidejobDialogFormWarning.notSelected;
    }

    const validationResult = this._controller.validateSidejob(this._sidejob);

    if (validationResult === SidejobValidationResult.notEnoughConnectivity) {
      const connectivityGrowth = this._controller.getConnectivityGrowth(this._sidejob.district.index);

      if (connectivityGrowth > 0) {
        return AssignCloneSidejobDialogFormWarning.willBeAvailableIn;
      }
    }

    if (validationResult === SidejobValidationResult.valid && this._existingSidejob) {
      return AssignCloneSidejobDialogFormWarning.alreadyAssigned;
    }

    return validationResult;
  }

  private updateAvailabilityTimer(): void {
    if (!this._sidejob) {
      return;
    }

    if (!this._availableTimeRef.value) {
      return;
    }

    const currentPoints = this._controller.getTotalConnectivity(this._sidejob.district.index);
    const requiredPoints = this._controller.getRequiredConnectivity(this._sidejob.sidejobName);
    const connectivityGrowth = this._controller.getConnectivityGrowth(this._sidejob.district.index);
    const pointsDiff = requiredPoints - currentPoints;

    if (pointsDiff < 0 || connectivityGrowth < 0) {
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
