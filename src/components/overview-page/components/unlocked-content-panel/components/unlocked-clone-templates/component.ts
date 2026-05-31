import { html } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent, compareTieredOptions, HINT_ICON, ISelectTieredOption } from '@shared/index';
import { CATEGORY_TEXTS, CLONE_TEMPLATE_TEXTS } from '@texts/index';
import { OverviewUnlockedCloneTemplatesController } from './controller';
import { unlockedItemsCategoryStyles } from '../../styles';
import { ItemTypeFilter } from '../../types';

@localized()
@customElement('ca-overview-unlocked-clone-templates')
export class OverviewUnlockedCloneTemplates extends BaseComponent {
  static styles = unlockedItemsCategoryStyles;

  @property({
    attribute: 'item-type-filer',
  })
  itemTypeFilter!: ItemTypeFilter;

  private _controller: OverviewUnlockedCloneTemplatesController;

  constructor() {
    super();

    this._controller = new OverviewUnlockedCloneTemplatesController(this);
  }

  renderDesktop() {
    const cloneTemplatesCategory = CATEGORY_TEXTS.cloneTemplates();

    return html`
      <sl-details>
        <h4 class="title" slot="summary">${cloneTemplatesCategory}</h4>

        <div class="content-table">${this.renderList()}</div>
      </sl-details>
    `;
  }

  private renderList = () => {
    const itemNames = this.getItemsList();

    const itemsOptions: ISelectTieredOption[] = itemNames.map((itemName) => ({
      name: CLONE_TEMPLATE_TEXTS[itemName].title(),
      value: itemName,
      tier: this.getItemTier(itemName),
    }));
    itemsOptions.sort(compareTieredOptions);

    return itemsOptions.map(this.renderListItem);
  };

  private renderListItem = (option: ISelectTieredOption) => {
    const cloneTemplateTitle = option.name;
    const cloneTemplateOverview = CLONE_TEMPLATE_TEXTS[option.value].overview();
    const tier = option.tier;

    return html`
      <span>
        ${cloneTemplateTitle}

        <sl-tooltip>
          <span slot="content"> ${cloneTemplateOverview} </span>

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

  private getItemTier(itemName: string) {
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
