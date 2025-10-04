import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';
import SlProgressBar from '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.component.js';
import { type IClone } from '@state/company-state';
import { BaseComponent, calculateLevelProgressPercentage } from '@shared/index';
import { cloneContext } from '../item/contexts';
import { ClonesListItemExperienceController } from './controller';
import styles from './styles';
import { COMMON_TEXTS } from '@/texts';

@localized()
@customElement('ca-clones-list-item-experience')
export class ClonesListItemExperience extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: ClonesListItemExperienceController;

  @consume({ context: cloneContext, subscribe: true })
  private _clone?: IClone;

  private _progressBarRef = createRef<SlProgressBar>();
  private _timerHintRef = createRef<HTMLParagraphElement>();
  private _higherDevelopmentLevelHintRef = createRef<HTMLParagraphElement>();
  private _timerRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new ClonesListItemExperienceController(this);
  }

  protected renderDesktop() {
    if (!this._clone) {
      return nothing;
    }

    return html`
      <div class="title">${msg('Next level progress')}</div>
      <sl-progress-bar ${ref(this._progressBarRef)}></sl-progress-bar>

      <p ${ref(this._timerHintRef)} class="progress-bar-hint">
        ${msg(html`Next level will be reached in ${html`<span ${ref(this._timerRef)}></span>`}`)}
      </p>

      <p ${ref(this._higherDevelopmentLevelHintRef)} class="progress-bar-hint">
        ${COMMON_TEXTS.higherDevelopmentLevelRequired()}
      </p>
    `;
  }

  handlePartialUpdate = () => {
    if (!this._clone) {
      return;
    }

    this.updateDevelopmentLevelHint();
    this.updateTimer();
  };

  private updateDevelopmentLevelHint() {
    if (!this._higherDevelopmentLevelHintRef.value) {
      return;
    }

    const nextLevelRequirements = this._clone!.getLevelRequirements(this._clone!.level);
    const reachedMaxLevel =
      this._clone!.experience >= nextLevelRequirements && this._clone!.level >= this._controller.developmentLevel;

    if (reachedMaxLevel) {
      this._higherDevelopmentLevelHintRef.value.classList.add('visible');
    } else {
      this._higherDevelopmentLevelHintRef.value.classList.remove('visible');
    }
  }

  private updateTimer() {
    const nextLevelRequirements = this._clone!.getLevelRequirements(this._clone!.level);

    if (this._progressBarRef.value) {
      const progressBarValue = calculateLevelProgressPercentage(
        this._clone!.getLevelRequirements(this._clone!.level - 1),
        this._clone!.experience,
        nextLevelRequirements,
      );

      this._progressBarRef.value.value = progressBarValue;
    }

    const experienceGrowth = this._controller.getCloneExperienceGrowth(this._clone!.id);
    const canReachNextLevel = experienceGrowth > 0 && this._clone!.experience < nextLevelRequirements;

    if (this._timerHintRef.value) {
      if (canReachNextLevel) {
        this._timerHintRef.value.classList.add('visible');
      } else {
        this._timerHintRef.value.classList.remove('visible');
      }
    }

    if (this._timerRef.value && canReachNextLevel) {
      const formattedTime = this._controller.formatter.formatTimeLong(
        (nextLevelRequirements - this._clone!.experience) / experienceGrowth,
      );

      this._timerRef.value.textContent = formattedTime;
    }
  }
}
