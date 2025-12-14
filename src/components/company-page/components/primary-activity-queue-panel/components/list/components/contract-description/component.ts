import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';
import SlProgressBar from '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.component.js';
import { BaseComponent, calculateLevelProgressPercentage, BaseController } from '@shared/index';
import { type IContractActivity } from '@state/activity-state';
import { COMMON_TEXTS } from '@texts/index';
import { primaryActivityContext } from '../list-item/contexts';
import styles from './styles';

@localized()
@customElement('ca-primary-activity-queue-list-item-contract-description')
export class PrimaryActivityQueueListItemContractDescription extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  @property({
    attribute: 'details-visible',
    type: Boolean,
  })
  public detailsVisible!: boolean;

  private _controller: BaseController;

  @consume({ context: primaryActivityContext, subscribe: true })
  private _contractActivity?: IContractActivity;

  private _progressBarRef = createRef<SlProgressBar>();
  private _timerRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new BaseController(this);
  }

  protected renderDesktop() {
    if (!this._contractActivity) {
      return nothing;
    }

    return html`
      <div class="title">${msg('Completion progress')}</div>
      <sl-progress-bar ${ref(this._progressBarRef)}></sl-progress-bar>

      <p class="progress-bar-hint visible">
        ${msg(html`Contract will completed in ${html`<span ${ref(this._timerRef)}></span>`}`)}
      </p>

      ${this.renderDetails()}
    `;
  }

  private renderDetails = () => {
    if (!this._contractActivity || !this.detailsVisible) {
      return nothing;
    }

    const contractName = this._contractActivity.contractAssignment.contract.contractName;
    const availableAmount =
      this._contractActivity.contractAssignment.contract.district.counters.contracts.getAvailableAmount(contractName);
    const formattedAvailableAmount = this._controller.formatter.formatNumberDecimal(availableAmount);

    const formattedCompletionTime = this._controller.formatter.formatTimeShort(
      this._contractActivity.contractAssignment.contract.completionTime,
    );

    return html`
      <p class="text">${COMMON_TEXTS.parameterRow(msg('Available'), formattedAvailableAmount)}</p>
      <p class="text">${COMMON_TEXTS.parameterRow(COMMON_TEXTS.completionTime(), formattedCompletionTime)}</p>
    `;
  };

  handlePartialUpdate = () => {
    if (!this._contractActivity) {
      return;
    }

    const currentTime = this._contractActivity.passedTime;
    const completionTime = this._contractActivity.contractAssignment.contract.completionTime;

    if (this._progressBarRef.value) {
      const progressBarValue = calculateLevelProgressPercentage(0, currentTime, completionTime);

      this._progressBarRef.value.value = progressBarValue;
    }

    if (this._timerRef.value) {
      const formattedTime = this._controller.formatter.formatTimeLong(completionTime - currentTime);

      this._timerRef.value.textContent = formattedTime;
    }
  };
}
