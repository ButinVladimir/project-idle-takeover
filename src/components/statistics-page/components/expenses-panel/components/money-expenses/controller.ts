import { BaseController, PurchaseType } from '@shared/index';

export class StatisticsMoneyExpensesController extends BaseController {
  getMoneyExpenses = (purchaseType: PurchaseType) => {
    return this.globalState.money.getExpenses(purchaseType);
  };
}
