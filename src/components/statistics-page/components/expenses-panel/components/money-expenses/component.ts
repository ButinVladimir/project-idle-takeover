import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, PurchaseType, PURCHASE_TYPES } from '@shared/index';
import { STATISTIC_PAGE_TEXTS } from '@components/statistics-page/constants';
import { StatisticsMoneyExpensesController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';
import { MONEY_EXPENSE_NAMES } from './constants';

@localized()
@customElement('ca-statistics-money-expenses')
export class StatisticsMoneyExpenses extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  private _controller: StatisticsMoneyExpensesController;

  constructor() {
    super();

    this._controller = new StatisticsMoneyExpensesController(this);
  }

  protected renderDesktop() {
    const formatter = this._controller.formatter;
    const moneyTotal = this.getTotalExpenses();

    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Money expenses')}</h4>

        <div class="parameters-table">
          ${PURCHASE_TYPES.map(this.renderExpenseArticle)}

          <div>${STATISTIC_PAGE_TEXTS.total()}</div>
          <div>${formatter.formatNumberFloat(moneyTotal)}</div>
        </div>
      </sl-details>
    `;
  }

  private getTotalExpenses() {
    let sum = 0;

    for (const purchaseType of PURCHASE_TYPES) {
      sum += this._controller.getMoneyExpenses(purchaseType);
    }

    return sum;
  }

  private renderExpenseArticle = (purchaseType: PurchaseType) => {
    const value = this._controller.getMoneyExpenses(purchaseType);

    if (value <= 0) {
      return '';
    }

    const formatter = this._controller.formatter;

    return html`
      <div>${MONEY_EXPENSE_NAMES[purchaseType]()}</div>
      <div>${formatter.formatNumberFloat(value)}</div>
    `;
  };
}
