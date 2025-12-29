import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import SlProgressBar from '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.component.js';
import { BaseComponent, calculateLevelProgressPercentage } from '@shared/index';
import { CityDistrictSidejobsListItemUnlockProgressController } from './controller';
import { contractNameContext } from '../contracts-list-item/contexts';
import { districtIndexContext } from '../../../../contexts';
import styles from './styles';

@localized()
@customElement('ca-city-district-contracts-list-item-generation-progress')
export class CityDistrictContractsListItemUnlockProgress extends BaseComponent {
  static styles = styles;

  readonly hasPartialUpdate = true;

  @consume({ context: districtIndexContext, subscribe: true })
  _districtIndex!: number;

  @consume({ context: contractNameContext, subscribe: true })
  private _contractName!: string;

  private _controller: CityDistrictSidejobsListItemUnlockProgressController;

  private _progressBarRef = createRef<SlProgressBar>();
  private _timerRef = createRef<HTMLSpanElement>();
  private _chanceRef = createRef<HTMLSpanElement>();
  private _unlockedMessageRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new CityDistrictSidejobsListItemUnlockProgressController(this);
  }

  protected renderDesktop() {
    if (this._districtIndex === undefined || this._contractName === undefined) {
      return nothing;
    }

    return html`
      <sl-progress-bar ${ref(this._progressBarRef)}>
        <span class="progress-bar-content" ${ref(this._unlockedMessageRef)}></span>
      </sl-progress-bar>
      <p class="progress-bar-hint visible">
        ${msg(
          html`Contract will be generated in ${html`<span ${ref(this._timerRef)}></span>`} with chance
          ${html`<span ${ref(this._chanceRef)}></span>`}%`,
        )}
      </p>
    `;
  }

  handlePartialUpdate = () => {
    if (this._districtIndex === undefined || this._contractName === undefined) {
      return;
    }

    const passedTime = this._controller.getPassedTime(this._contractName, this._districtIndex);
    const requiredTime = this._controller.getRequiredTime(this._contractName, this._districtIndex);

    if (this._progressBarRef.value) {
      const progressBarValue = calculateLevelProgressPercentage(0, passedTime, requiredTime);

      this._progressBarRef.value.value = progressBarValue;
    }

    if (this._timerRef.value) {
      const formattedTime = this._controller.formatter.formatTimeLong(requiredTime - passedTime);

      this._timerRef.value.textContent = formattedTime;
    }

    if (this._chanceRef.value) {
      const chance = this._controller.getChance(this._contractName, this._districtIndex);
      const formattedChance = this._controller.formatter.formatNumberFloat(chance * 100);

      this._chanceRef.value.textContent = formattedChance;
    }
  };
}
