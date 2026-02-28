import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';
import SlProgressBar from '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.component.js';
import { BaseComponent, calculateLevelProgressPercentage } from '@shared/index';
import { OverviewDevelopmentLevelProgressController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-overview-development-level-progress')
export class OverviewDevelopmentLevelProgress extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: OverviewDevelopmentLevelProgressController;

  private _progressBarRef = createRef<SlProgressBar>();
  private _hintRef = createRef<HTMLParagraphElement>();
  private _timerRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new OverviewDevelopmentLevelProgressController(this);
  }

  protected renderDesktop() {
    return html`
      <div class="block">
        <h5 class="progress-bar-title">${msg('Next development level progress')}</h5>

        <sl-progress-bar ${ref(this._progressBarRef)}> </sl-progress-bar>

        <p ${ref(this._hintRef)} class="progress-bar-hint">
          ${msg(html`Next development level will be reached in ${html`<span ${ref(this._timerRef)}></span>`}`)}
        </p>
      </div>
    `;
  }

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;

    if (this._progressBarRef.value) {
      const nextDevelopmentLevelProgressBarValue = calculateLevelProgressPercentage(
        this._controller.getPrevDevelopmentLevelPoints(),
        this._controller.getCurrentDevelopmentPoints(),
        this._controller.getNextDevelopmentLevelPoints(),
      );

      this._progressBarRef.value.value = nextDevelopmentLevelProgressBarValue;
    }

    const developmentGrowth = this._controller.getDevelopmentGrowth();

    if (this._hintRef.value) {
      if (developmentGrowth > 0) {
        this._hintRef.value.classList.add('visible');
      } else {
        this._hintRef.value.classList.remove('visible');
      }
    }

    if (this._timerRef.value && developmentGrowth > 0) {
      const formattedTime = formatter.formatTimeLong(
        this._controller.getDevelopmentPointsUntilNextLevel() / developmentGrowth,
      );

      this._timerRef.value.textContent = formattedTime;
    }
  };
}
