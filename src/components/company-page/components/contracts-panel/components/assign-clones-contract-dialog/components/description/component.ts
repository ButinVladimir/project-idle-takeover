import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { choose } from 'lit/directives/choose.js';
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js';
import { BaseComponent, getHighlightValueClass } from '@shared/index';
import { COMMON_TEXTS, CONTRACT_TEXTS } from '@texts/index';
import { type IContract } from '@state/activity-state';
import { temporaryContractContext } from '../../contexts';
import { AssignClonesContractDialogDescriptionMode } from './types';
import { DESCRIPTION_MODE_TEXTS, DESCRIPTION_MODES } from './constants';
import { AssignCloneSidejobDialogDescriptionController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-assign-clones-contract-dialog-description')
export class AssignClonesContractDialogDescription extends BaseComponent {
  static styles = styles;

  private _controller: AssignCloneSidejobDialogDescriptionController;

  private _descriptionModelInputRef = createRef<SlRadioGroup>();

  @consume({ context: temporaryContractContext, subscribe: true })
  private _contract?: IContract;

  @state()
  private _desciptionMode: AssignClonesContractDialogDescriptionMode =
    AssignClonesContractDialogDescriptionMode.requirements;

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogDescriptionController(this);
  }

  protected renderDesktop() {
    if (!this._contract) {
      return nothing;
    }

    const availableCount = this._controller.getAvailableCount(
      this._contract.district.index,
      this._contract.contractName,
    );
    const formattedAvalailableCount = this._controller.formatter.formatNumberDecimal(availableCount);

    return html`
      <p class="hint">${CONTRACT_TEXTS[this._contract.contractName].overview()}</p>

      ${this.renderTeamSizeString()}
      <p class="text">${COMMON_TEXTS.parameterValue(msg('Available'), formattedAvalailableCount)}</p>

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
        [AssignClonesContractDialogDescriptionMode.requirements, this.renderRequirements],
        [AssignClonesContractDialogDescriptionMode.rewardsMultipliers, this.renderRewardMultipliers],
        [AssignClonesContractDialogDescriptionMode.rewards, this.renderRewards],
      ])}
    `;
  }

  private renderTeamSizeString = () => {
    const formatter = this._controller.formatter;

    const minClones = this._contract!.minRequiredClones;
    const maxClones = this._contract!.maxRequiredClones;
    const assignedClones = this._contract!.assignedClones.length;

    const formattedMinClones = formatter.formatNumberDecimal(minClones);
    const formattedMaxClones = formatter.formatNumberDecimal(maxClones);
    const formattedAssignedClones = formatter.formatNumberDecimal(assignedClones);

    const valueClass = getHighlightValueClass(assignedClones >= minClones && assignedClones <= maxClones);

    const assignedClonesText = msg(str`${formattedAssignedClones} / ${formattedMinClones} (max ${formattedMaxClones})`);
    const assignedClonesElem = html`<span class=${valueClass}>${assignedClonesText}</span>`;

    return html` <p class="text">${COMMON_TEXTS.parameterValue(msg('Assigned clones'), assignedClonesElem)}</p> `;
  };

  private handleDescriptionModeChange = () => {
    if (!this._descriptionModelInputRef.value) {
      return;
    }

    this._desciptionMode = this._descriptionModelInputRef.value.value as AssignClonesContractDialogDescriptionMode;
  };

  private renderDescriptionModes = () => {
    return DESCRIPTION_MODES.map(this.renderDescriptionMode);
  };

  private renderDescriptionMode = (descriptionMode: AssignClonesContractDialogDescriptionMode) => {
    return html`<sl-radio-button value=${descriptionMode}
      >${DESCRIPTION_MODE_TEXTS[descriptionMode]()}</sl-radio-button
    >`;
  };

  private renderRequirements = () => {
    return html`<ca-assign-clones-contract-dialog-requirements></ca-assign-clones-contract-dialog-requirements>`;
  };

  private renderRewardMultipliers = () => {
    return html`<ca-assign-clones-contract-dialog-rewards-multipliers></ca-assign-clones-contract-dialog-rewards-multipliers>`;
  };

  private renderRewards = () => {
    return html`<ca-assign-clones-contract-dialog-rewards></ca-assign-clones-contract-dialog-rewards>`;
  };
}
