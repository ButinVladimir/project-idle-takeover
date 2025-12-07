import { html, nothing } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { BaseComponent } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { ClonesSynchronizationValuesController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-clones-synchronization-values')
export class ClonesSynchronizationValuesPanel extends BaseComponent {
  static styles = styles;

  hasPartialUpdate = true;

  private _controller: ClonesSynchronizationValuesController;

  private _experienceShareRef = createRef<HTMLSpanElement>();

  constructor() {
    super();

    this._controller = new ClonesSynchronizationValuesController(this);
  }

  renderDesktop() {
    const formatter = this._controller.formatter;

    const formattedAvailableSynchronization = formatter.formatNumberDecimal(this._controller.availableSynchronization);
    const formattedTotalSynchronization = formatter.formatNumberDecimal(this._controller.totalSynchronization);

    return html`
      <div>
        ${COMMON_TEXTS.parameterRow(
          msg('Available synchronization'),
          `${formattedAvailableSynchronization} / ${formattedTotalSynchronization}`,
        )}
      </div>

      ${this._controller.isExperienceShareUnlocked()
        ? html`
            <div>
              ${COMMON_TEXTS.parameterRow(
                msg('Shared experience'),
                html`× <span ${ref(this._experienceShareRef)}></span>`,
              )}
            </div>
          `
        : nothing}
    `;
  }

  handlePartialUpdate = () => {
    if (this._experienceShareRef.value) {
      const formattedExperienceShareMultiplier = this._controller.formatter.formatNumberFloat(
        this._controller.experienceShareMultiplier,
      );

      this._experienceShareRef.value.textContent = formattedExperienceShareMultiplier;
    }
  };
}
