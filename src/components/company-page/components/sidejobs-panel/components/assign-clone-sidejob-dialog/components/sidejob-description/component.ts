import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { choose } from 'lit/directives/choose.js';
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js';
import { BaseComponent } from '@shared/index';
import { type ISidejob } from '@state/activity-state';
import { temporarySidejobContext } from '../batch-item/contexts';
import { AssignCloneSidejobDialogDescriptionMode } from './types';
import { DESCRIPTION_MODE_TEXTS, DESCRIPTION_MODES } from './constants';
import styles from './styles';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-sidejob-description')
export class AssignCloneSidejobDialogSidejobDescription extends BaseComponent {
  static styles = styles;

  private _descriptionModelInputRef = createRef<SlRadioGroup>();

  @consume({ context: temporarySidejobContext, subscribe: true })
  private _sidejob?: ISidejob;

  @state()
  private _desciptionMode: AssignCloneSidejobDialogDescriptionMode =
    AssignCloneSidejobDialogDescriptionMode.requirements;

  protected renderDesktop() {
    if (!this._sidejob) {
      return nothing;
    }

    return html`
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
}
