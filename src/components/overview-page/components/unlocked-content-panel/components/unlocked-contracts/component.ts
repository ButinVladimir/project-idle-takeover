import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, HINT_ICON } from '@shared/index';
import { CONTRACT_TEXTS } from '@texts/index';
import { OverviewUnlockedContractsController } from './controller';
import { unlockedContentStyles } from '../../styles';

@localized()
@customElement('ca-overview-unlocked-contracts')
export class OverviewUnlockedContracts extends BaseComponent {
  static styles = unlockedContentStyles;

  private _controller: OverviewUnlockedContractsController;

  constructor() {
    super();

    this._controller = new OverviewUnlockedContractsController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Contracts')}</h4>

        <div class="content-table">${this.renderList()}</div>
      </sl-details>
    `;
  }

  private renderList = () => {
    const itemNames = this._controller.listUnlockedContracts();

    return itemNames.map(this.renderListItem);
  };

  private renderListItem = (sidejobName: string) => {
    const title = CONTRACT_TEXTS[sidejobName].title();
    const overview = CONTRACT_TEXTS[sidejobName].overview();

    return html`
      <span>
        ${title}

        <sl-tooltip>
          <span slot="content"> ${overview} </span>

          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </span>
    `;
  };
}
