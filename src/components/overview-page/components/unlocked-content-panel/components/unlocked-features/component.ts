import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, Feature, HINT_ICON } from '@shared/index';
import { UNLOCKED_FEATURE_TEXTS } from '@texts/index';
import { OverviewUnlockedFeaturesController } from './controller';
import { unlockedContentStyles } from '../../styles';

@localized()
@customElement('ca-overview-unlocked-features')
export class OverviewUnlockedFeatures extends BaseComponent {
  static styles = unlockedContentStyles;

  private _controller: OverviewUnlockedFeaturesController;

  constructor() {
    super();

    this._controller = new OverviewUnlockedFeaturesController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Features')}</h4>

        <div class="content-table">${this.renderList()}</div>
      </sl-details>
    `;
  }

  private renderList = () => {
    const items = this._controller.listUnlockedFeatures();

    return items.map(this.renderListItem);
  };

  private renderListItem = (feature: Feature) => {
    const title = UNLOCKED_FEATURE_TEXTS[feature].title();
    const hint = UNLOCKED_FEATURE_TEXTS[feature].hint();

    return html`
      <span>
        ${title}

        <sl-tooltip>
          <span slot="content"> ${hint} </span>

          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </span>
    `;
  };
}
