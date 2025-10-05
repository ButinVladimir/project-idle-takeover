import { html } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent, HINT_ICON } from '@shared/index';
import { CATEGORY_TEXTS, PROGRAM_TEXTS } from '@texts/index';
import { ProgramName } from '@state/mainframe-state';
import { OverviewUnlockedProgramsController } from './controller';
import { unlockedItemsCategoryStyles } from '../../styles';
import { ItemTypeFilter } from '../../types';

@localized()
@customElement('ca-overview-unlocked-programs')
export class OverviewUnlockedPrograms extends BaseComponent {
  static styles = unlockedItemsCategoryStyles;

  @property({
    attribute: 'item-type-filer',
  })
  itemTypeFilter!: ItemTypeFilter;

  private _controller: OverviewUnlockedProgramsController;

  constructor() {
    super();

    this._controller = new OverviewUnlockedProgramsController(this);
  }

  protected renderDesktop() {
    const programsCategory = CATEGORY_TEXTS.programs();

    return html`
      <sl-details>
        <h4 class="title" slot="summary">${programsCategory}</h4>

        <div class="content-table">${this.renderList()}</div>
      </sl-details>
    `;
  }

  private renderList = () => {
    const itemNames = this.getItemsList();

    return itemNames.map(this.renderListItem);
  };

  private renderListItem = (itemName: ProgramName) => {
    const programTitle = PROGRAM_TEXTS[itemName].title();
    const programOverview = PROGRAM_TEXTS[itemName].overview();
    const tier = this.getItemTier(itemName);

    return html`
      <span>
        ${programTitle}

        <sl-tooltip>
          <span slot="content"> ${programOverview} </span>

          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </span>
      <span> ${this._controller.formatter.formatTier(tier)} </span>
    `;
  };

  private getItemsList() {
    switch (this.itemTypeFilter) {
      case ItemTypeFilter.all:
        return this._controller.listAllItems();
      case ItemTypeFilter.design:
        return this._controller.listDesigns();
      case ItemTypeFilter.loaned:
        return this._controller.listLoanedItems();
    }
  }

  private getItemTier(itemName: ProgramName) {
    switch (this.itemTypeFilter) {
      case ItemTypeFilter.all:
        return this._controller.getItemHighestAvailableTier(itemName);
      case ItemTypeFilter.design:
        return this._controller.getDesignTier(itemName);
      case ItemTypeFilter.loaned:
        return this._controller.getLoanedTier();
    }
  }
}
