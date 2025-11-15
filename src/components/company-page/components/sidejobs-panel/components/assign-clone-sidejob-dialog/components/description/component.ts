import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { choose } from 'lit/directives/choose.js';
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js';
import { BaseComponent, getHighlightValueClass, RewardParameter } from '@shared/index';
import { COMMON_TEXTS, REWARD_PARAMETER_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { type ISidejob } from '@state/activity-state';
import { temporarySidejobContext } from '../../contexts';
import { AssignCloneSidejobDialogDescriptionMode } from './types';
import { DESCRIPTION_MODE_TEXTS, DESCRIPTION_MODES } from './constants';
import { AssignCloneSidejobDialogDescriptionController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-description')
export class AssignCloneSidejobDialogDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: AssignCloneSidejobDialogDescriptionController;

  private _descriptionModelInputRef = createRef<SlRadioGroup>();

  private _connectivityValuesSpanRef = createRef<HTMLSpanElement>();
  private _connectivityTotalValueSpanRef = createRef<HTMLSpanElement>();

  @consume({ context: temporarySidejobContext, subscribe: true })
  private _sidejob?: ISidejob;

  @state()
  private _desciptionMode: AssignCloneSidejobDialogDescriptionMode =
    AssignCloneSidejobDialogDescriptionMode.requirements;

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this._sidejob) {
      return nothing;
    }

    return html`
      <p class="hint">${SIDEJOB_TEXTS[this._sidejob.sidejobName].overview()}</p>

      ${this.renderConnectivityString()}

      <sl-radio-group
        ${ref(this._descriptionModelInputRef)}
        name="desciption-mode"
        size="small"
        value=${this._desciptionMode}
        @sl-change=${this.handleDescriptionModeChange}
      >
        ${this.renderDescriptionModes()}
      </sl-radio-group>

      ${choose(this._desciptionMode, [
        [AssignCloneSidejobDialogDescriptionMode.requirements, this.renderRequirements],
        [AssignCloneSidejobDialogDescriptionMode.rewardsMultipliers, this.renderRewardMultipliers],
        [AssignCloneSidejobDialogDescriptionMode.rewards, this.renderRewards],
      ])}
    `;
  }

  private renderConnectivityString = () => {
    const formatter = this._controller.formatter;

    const requiredConnectivity = this._controller.getRequiredConnectivity(this._sidejob!.sidejobName);
    const formattedRequiredConnectivity = formatter.formatNumberFloat(requiredConnectivity);

    const connectivityValue = html`
      <span ${ref(this._connectivityValuesSpanRef)}
        ><span ${ref(this._connectivityTotalValueSpanRef)}></span> / ${formattedRequiredConnectivity}</span
      >
    `;

    return html`
      <p class="text">
        ${COMMON_TEXTS.parameterValue(REWARD_PARAMETER_NAMES[RewardParameter.connectivity](), connectivityValue)}
      </p>
    `;
  };

  private handleDescriptionModeChange = () => {
    if (!this._descriptionModelInputRef.value) {
      return;
    }

    this._desciptionMode = this._descriptionModelInputRef.value.value as AssignCloneSidejobDialogDescriptionMode;
  };

  private renderDescriptionModes = () => {
    return DESCRIPTION_MODES.map(this.renderDescriptionMode);
  };

  private renderDescriptionMode = (descriptionMode: AssignCloneSidejobDialogDescriptionMode) => {
    return html`<sl-radio-button value=${descriptionMode}
      >${DESCRIPTION_MODE_TEXTS[descriptionMode]()}</sl-radio-button
    >`;
  };

  private renderRequirements = () => {
    return html` <ca-assign-clone-sidejob-dialog-requirements> </ca-assign-clone-sidejob-dialog-requirements> `;
  };

  private renderRewardMultipliers = () => {
    return html`
      <ca-assign-clone-sidejob-dialog-rewards-multipliers> </ca-assign-clone-sidejob-dialog-rewards-multipliers>
    `;
  };

  private renderRewards = () => {
    return html` <ca-assign-clone-sidejob-dialog-rewards> </ca-assign-clone-sidejob-dialog-rewards> `;
  };

  handlePartialUpdate = () => {
    if (!this._sidejob) {
      return;
    }

    const totalConnectivity = this._controller.getTotalConnectivity(this._sidejob.district.index);

    if (this._connectivityTotalValueSpanRef.value) {
      const formatter = this._controller.formatter;
      const formattedTotalConnectivity = formatter.formatNumberFloat(totalConnectivity);
      this._connectivityTotalValueSpanRef.value.textContent = formattedTotalConnectivity;
    }

    if (this._connectivityValuesSpanRef.value) {
      const requiredConnectivity = this._controller.getRequiredConnectivity(this._sidejob.sidejobName);
      const valid = totalConnectivity >= requiredConnectivity;
      const connectivityClasses = getHighlightValueClass(valid);

      this._connectivityValuesSpanRef.value.className = connectivityClasses;
    }
  };
}
