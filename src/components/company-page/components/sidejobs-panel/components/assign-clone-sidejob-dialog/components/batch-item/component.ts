import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { SidejobValidationResult, type ISidejob } from '@state/activity-state';
import { BaseComponent } from '@shared/index';
import { DISTRICT_NAMES, SIDEJOB_TEXTS, SIDEJOB_VALIDATION_TEXTS } from '@texts/index';
import { AssignCloneSidejobDialogBatchItemController } from './controller';
import { existingSidejobContext, temporarySidejobContext } from './contexts';
import styles from './styles';
import { AssignCloneSidejobDialogBatchItemFormWarning, AssignCloneSidejobDialogBatchItemWarning } from './types';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-batch-item')
export class AssignCloneSidejobDialogBatchItem extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'sidejob-name',
    type: String,
  })
  sidejobName!: string;

  @property({
    attribute: 'district-index',
    type: Number,
  })
  districtIndex!: number;

  @property({
    attribute: 'clone-id',
    type: String,
  })
  cloneId!: string;

  private _controller: AssignCloneSidejobDialogBatchItemController;

  @provide({ context: temporarySidejobContext })
  private _sidejob?: ISidejob;

  @provide({ context: existingSidejobContext })
  private _existingSidejob?: ISidejob;

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogBatchItemController(this);
  }

  protected renderDesktop() {
    if (!this._sidejob) {
      return nothing;
    }

    return html`
      <sl-details>
        <div slot="summary">
          <h5 class="title">${msg(str`Sidejob for clone "${this._sidejob.assignedClone.name}"`)}</h5>

          <p class="warning">${this.renderWarning()}</p>
        </div>

        <article>
          <ca-assign-clone-sidejob-dialog-sidejob-description></ca-assign-clone-sidejob-dialog-sidejob-description>
        </article>
      </sl-details>
    `;
  }

  protected updateContext() {
    this._sidejob = this._controller.makeSidejob(this.sidejobName, this.districtIndex, this.cloneId);
    this._existingSidejob = this._controller.getExistingSidejobByClone(this.cloneId);
  }

  private renderWarning = () => {
    if (!this._sidejob) {
      return nothing;
    }

    const warning = this.selectWarning();

    switch (warning) {
      case SidejobValidationResult.districtLocked:
      case SidejobValidationResult.sidejobNotAvailable:
      case SidejobValidationResult.requirementsNotMet:
        return SIDEJOB_VALIDATION_TEXTS[warning]();
      case AssignCloneSidejobDialogBatchItemFormWarning.alreadyAssigned:
        return this.makeAlreadyAssignedWarning();
      default:
        return nothing;
    }

    return nothing;
  };

  private selectWarning(): AssignCloneSidejobDialogBatchItemWarning {
    const validationResult = this._controller.validateSidejob(this._sidejob!);

    if (validationResult !== SidejobValidationResult.valid) {
      return validationResult;
    }

    if (this._existingSidejob) {
      return AssignCloneSidejobDialogBatchItemFormWarning.alreadyAssigned;
    }

    return SidejobValidationResult.valid;
  }

  private makeAlreadyAssignedWarning() {
    const sidejobName = SIDEJOB_TEXTS[this._existingSidejob!.sidejobName].title();
    const districtName = DISTRICT_NAMES[this._existingSidejob!.district.name]();

    return msg(str`Clone is already assigned to the sidejob "${sidejobName}" in district "${districtName}"`);
  }
}
