import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import SlProgressBar from '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.component.js';
import { BaseComponent, calculateLevelProgressPercentage } from '@shared/index';
import { DistrictUnlockState } from '@state/city-state';
import { CityDistrictOverviewPanelNextTierProgressController } from './controller';
import { districtIndexContext } from '../../../../contexts';
import styles from './styles';

@localized()
@customElement('ca-city-district-overview-panel-next-tier-progress')
export class CityDistrictOverviewPanelNextTierProgress extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  @consume({ context: districtIndexContext, subscribe: true })
  private _districtIndex?: number;

  private _controller: CityDistrictOverviewPanelNextTierProgressController;

  private _progressBarRef = createRef<SlProgressBar>();
  private _hintRef = createRef<HTMLParagraphElement>();
  private _timerRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new CityDistrictOverviewPanelNextTierProgressController(this);
  }

  protected renderDesktop() {
    if (this._districtIndex === undefined) {
      return nothing;
    }

    const state = this._controller.getDistrictState(this._districtIndex);

    if (state === DistrictUnlockState.locked) {
      return nothing;
    }

    return html`
      <div class="title">
        ${state === DistrictUnlockState.captured ? msg('Next district tier progress') : msg('Capture progress')}
      </div>

      <sl-progress-bar ${ref(this._progressBarRef)}> </sl-progress-bar>

      <p ${ref(this._hintRef)} class="progress-bar-hint">
        ${state === DistrictUnlockState.captured
          ? msg(html`Next district tier will be reached in ${html`<span ${ref(this._timerRef)}></span>`}`)
          : msg(html`District will be captured in ${html`<span ${ref(this._timerRef)}></span>`}`)}
      </p>
    `;
  }

  handlePartialUpdate = () => {
    if (this._districtIndex === undefined) {
      return;
    }

    const formatter = this._controller.formatter;
    const currentPoints = this._controller.getDistrictInfluencePoints(this._districtIndex);
    const nexTierRequirements = this._controller.getNextTierRequirements(this._districtIndex);

    if (this._progressBarRef.value) {
      const nextDevelopmentLevelProgressBarValue = calculateLevelProgressPercentage(
        this._controller.getCurrentTierRequirements(this._districtIndex),
        currentPoints,
        nexTierRequirements,
      );

      this._progressBarRef.value.value = nextDevelopmentLevelProgressBarValue;
    }

    const developmentGrowth = this._controller.getDistrictInfluenceGrowth(this._districtIndex);

    if (this._hintRef.value) {
      if (developmentGrowth > 0) {
        this._hintRef.value.classList.add('visible');
      } else {
        this._hintRef.value.classList.remove('visible');
      }
    }

    if (this._timerRef.value && developmentGrowth > 0) {
      const formattedTime = formatter.formatTimeLong((nexTierRequirements - currentPoints) / developmentGrowth);

      this._timerRef.value.textContent = formattedTime;
    }
  };
}
