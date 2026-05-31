import isNil from 'lodash/isNil';
import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { BaseComponent, getHighlightValueClass, MULTIPLE_SELECT_SEPARATOR, RewardParameter } from '@shared/index';
import styles from './styles';
import { AssignCloneSidejobDialogBatchDescriptionController } from './controller';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-batch-description')
export class AssignCloneSidejobDialogBatchDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

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

  private _connectivityValuesSpanRef = createRef<HTMLSpanElement>();
  private _connectivityTotalValueSpanRef = createRef<HTMLSpanElement>();

  private _controller: AssignCloneSidejobDialogBatchDescriptionController;

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogBatchDescriptionController(this);
  }

  protected renderDesktop() {
    if (isNil(this.sidejobName) || isNil(this.districtIndex) || !this.cloneIds) {
      return nothing;
    }

    const cloneIds = this.cloneIds.split(MULTIPLE_SELECT_SEPARATOR);

    return html`
      <p class="text">${SIDEJOB_TEXTS[this.sidejobName].overview()}</p>

      ${this.renderConnectivityString()}
      ${repeat(
        cloneIds,
        (cloneId) => cloneId,
        (cloneId) =>
          html`<ca-assign-clone-sidejob-dialog-batch-item
            sidejob-name=${ifDefined(this.sidejobName)}
            district-index=${ifDefined(this.districtIndex)}
            clone-id=${cloneId}
          ></ca-assign-clone-sidejob-dialog-batch-item>`,
      )}
    `;
  }

  private renderConnectivityString = () => {
    const formatter = this._controller.formatter;

    const requiredConnectivity = this._controller.getRequiredConnectivity(this.sidejobName!);
    const formattedRequiredConnectivity = formatter.formatNumberFloat(requiredConnectivity);

    const connectivityValue = html`
      <span ${ref(this._connectivityValuesSpanRef)}
        ><span ${ref(this._connectivityTotalValueSpanRef)}></span> / ${formattedRequiredConnectivity}</span
      >
    `;

    return html`
      <p class="text">
        ${COMMON_TEXTS.parameterRow(REWARD_PARAMETER_NAMES[RewardParameter.connectivity](), connectivityValue)}
      </p>
    `;
  };

  handlePartialUpdate = () => {
    if (isNil(this.sidejobName) || isNil(this.districtIndex)) {
      return;
    }

    const totalConnectivity = this._controller.getTotalConnectivity(this.districtIndex);

    if (this._connectivityTotalValueSpanRef.value) {
      const formatter = this._controller.formatter;
      const formattedTotalConnectivity = formatter.formatNumberFloat(totalConnectivity);
      this._connectivityTotalValueSpanRef.value.textContent = formattedTotalConnectivity;
    }

    if (this._connectivityValuesSpanRef.value) {
      const requiredConnectivity = this._controller.getRequiredConnectivity(this.sidejobName);
      const valid = totalConnectivity >= requiredConnectivity;
      const connectivityClasses = getHighlightValueClass(valid);

      this._connectivityValuesSpanRef.value.className = connectivityClasses;
    }
  };
}
