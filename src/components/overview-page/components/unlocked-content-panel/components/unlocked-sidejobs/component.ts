import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, compareOptions, HINT_ICON, ISelectOption } from '@shared/index';
import { SIDEJOB_TEXTS } from '@texts/index';
import { OverviewUnlockedSidejobsController } from './controller';
import { unlockedContentStyles } from '../../styles';

@localized()
@customElement('ca-overview-unlocked-sidejobs')
export class OverviewUnlockedSidejobs extends BaseComponent {
  static styles = unlockedContentStyles;

  private _controller: OverviewUnlockedSidejobsController;

  constructor() {
    super();

    this._controller = new OverviewUnlockedSidejobsController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Sidejobs')}</h4>

        <div class="content-table">${this.renderList()}</div>
      </sl-details>
    `;
  }

  private renderList = () => {
    const itemNames = this._controller.listUnlockedSidejobs();

    const itemsOptions: ISelectOption[] = itemNames.map((itemName) => ({
      name: SIDEJOB_TEXTS[itemName].title(),
      value: itemName,
    }));
    itemsOptions.sort(compareOptions);

    return itemsOptions.map(this.renderListItem);
  };

  private renderListItem = (option: ISelectOption) => {
    const title = option.name;
    const overview = SIDEJOB_TEXTS[option.value].overview();

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
