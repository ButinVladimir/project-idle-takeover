import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume, provide } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent, HINT_ICON } from '@shared/index';
import { SIDEJOB_TEXTS } from '@texts/index';
import { sidejobNameContext } from './contexts';
import { districtIndexContext } from '../../../../contexts';
import styles from './styles';

@localized()
@customElement('ca-city-district-sidejobs-list-item')
export class CityDistrictSidejobsListItem extends BaseComponent {
  static styles = styles;

  @provide({ context: sidejobNameContext })
  @property({
    attribute: 'sidejob-name',
    type: String,
  })
  sidejobName!: string;

  protected hasMobileRender = true;

  @consume({ context: districtIndexContext, subscribe: true })
  private _districtIndex?: number;

  protected renderMobile() {
    return html`<div class="host-content mobile">${this.renderContent()}</div>`;
  }

  protected renderDesktop() {
    return html`<div class="host-content desktop">${this.renderContent()}</div>`;
  }

  private renderContent = () => {
    if (this._districtIndex === undefined) {
      return nothing;
    }

    return html`
      <div class="sidejob">
        <div class="description">
          <p class="title">
            ${SIDEJOB_TEXTS[this.sidejobName].title()}

            <sl-tooltip>
              <span slot="content">${SIDEJOB_TEXTS[this.sidejobName].overview()}</span>

              <sl-icon name=${HINT_ICON}></sl-icon>
            </sl-tooltip>
          </p>
        </div>
      </div>

      <div class="progress-bar">
        <ca-city-district-sidejobs-list-item-unlock-progress> </ca-city-district-sidejobs-list-item-unlock-progress>
      </div>
    `;
  };
}
