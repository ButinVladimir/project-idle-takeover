import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon.component.js';
import {
  ACTIVITY_UI_ACTIVITY_VALUES,
  ACTIVITY_UI_STATUSES,
  ActivityUIActivityStatus,
  BaseComponent,
} from '@shared/index';
import { SidejobValidationResult, type ISidejobActivity } from '@state/activity-state';
import { SIDEJOB_VALIDATION_TEXTS } from '@texts/index';
import { SidejobsListItemStatusController } from './controller';
import { sidejobActivityContext } from '../item/contexts';
import styles from './styles';

@localized()
@customElement('ca-sidejobs-list-item-status')
export class SidejobsListItemStatus extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  protected hasMobileRender = true;

  private _mobileTextRef = createRef<HTMLSpanElement>();
  private _desktopTooltipRef = createRef<HTMLSpanElement>();
  private _desktopIconRef = createRef<SlIcon>();
  private _controller: SidejobsListItemStatusController;

  @consume({ context: sidejobActivityContext, subscribe: true })
  private _activity?: ISidejobActivity;

  constructor() {
    super();

    this._controller = new SidejobsListItemStatusController(this);
  }

  protected renderDesktop() {
    if (!this._activity) {
      return nothing;
    }

    return html`
      <sl-tooltip>
        <span slot="content" ${ref(this._desktopTooltipRef)}></span>

        <sl-icon name="" class="desktop status-icon" ${ref(this._desktopIconRef)}> </sl-icon>
      </sl-tooltip>
    `;
  }

  protected renderMobile() {
    if (!this._activity) {
      return nothing;
    }

    return html` <span ${ref(this._mobileTextRef)}></span> `;
  }

  handlePartialUpdate = () => {
    const validationResult = this._controller.validateSidejob(this._activity!);
    const status = this.getStatus(validationResult);
    const text = this.getText(status, validationResult);

    if (this._desktopIconRef.value) {
      this._desktopIconRef.value.name = ACTIVITY_UI_ACTIVITY_VALUES[status].icon;
      this.applyStatusClass(this._desktopIconRef.value, status);
    }

    if (this._desktopTooltipRef.value) {
      this._desktopTooltipRef.value.textContent = text;
    }

    if (this._mobileTextRef.value) {
      this._mobileTextRef.value.textContent = text;
      this.applyStatusClass(this._mobileTextRef.value, status);
    }
  };

  private getStatus(validationResult: SidejobValidationResult): ActivityUIActivityStatus {
    if (this._activity!.active) {
      return ActivityUIActivityStatus.active;
    }

    if (validationResult === SidejobValidationResult.valid) {
      return ActivityUIActivityStatus.valid;
    }

    return ActivityUIActivityStatus.invalid;
  }

  private getText(status: ActivityUIActivityStatus, validationResult: SidejobValidationResult): string {
    switch (status) {
      case ActivityUIActivityStatus.active:
        return msg('Sidejob is active');
      case ActivityUIActivityStatus.invalid:
        return SIDEJOB_VALIDATION_TEXTS[validationResult]();
      default:
        return msg('Sidejob is inactive');
    }
  }

  private applyStatusClass(element: HTMLElement, status: ActivityUIActivityStatus) {
    ACTIVITY_UI_STATUSES.forEach((activityStatus) =>
      element.classList.remove(ACTIVITY_UI_ACTIVITY_VALUES[activityStatus].class),
    );

    element.classList.add(ACTIVITY_UI_ACTIVITY_VALUES[status].class);
  }
}
