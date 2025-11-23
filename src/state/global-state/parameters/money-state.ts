import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { IncomeSource, PurchaseType } from '@shared/index';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IScenarioState } from '@state/scenario-state';
import { TYPES } from '@state/types';
import { IMoneyState, IMoneySerializedState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class MoneyState implements IMoneyState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  private _money: number;
  private _income: Map<IncomeSource, number>;
  private _expenses: Map<PurchaseType, number>;

  constructor() {
    this._money = 0;
    this._income = new Map<IncomeSource, number>();
    this._expenses = new Map<PurchaseType, number>();

    this._stateUiConnector.registerEventEmitter(this, ['_expenses']);
  }

  get money() {
    return this._money;
  }

  increase(moneyDelta: number, incomeSource: IncomeSource): void {
    this._money += moneyDelta;
    const prevIncome = this.getIncome(incomeSource);
    this._income.set(incomeSource, prevIncome + moneyDelta);
  }

  purchase(cost: number, purchaseType: PurchaseType, handler: () => void): boolean {
    if (this._money >= cost) {
      this._money -= cost;
      handler();

      const prevExpenses = this.getExpenses(purchaseType);
      this._expenses.set(purchaseType, prevExpenses + cost);

      return true;
    }

    return false;
  }

  getIncome(incomeSource: IncomeSource): number {
    return this._income.get(incomeSource) ?? 0;
  }

  getExpenses(purchaseType: PurchaseType): number {
    return this._expenses.get(purchaseType) ?? 0;
  }

  async startNewState(): Promise<void> {
    this._money = this._scenarioState.currentValues.startingValues.money;
    this._income.clear();
    this._expenses.clear();
  }

  async deserialize(serializedState: IMoneySerializedState): Promise<void> {
    this._money = serializedState.money;

    this._income.clear();
    Object.entries(serializedState.income).forEach(([incomeSource, value]) => {
      this._income.set(incomeSource as IncomeSource, value);
    });

    this._expenses.clear();
    Object.entries(serializedState.expenses).forEach(([purchaseType, value]) => {
      this._expenses.set(purchaseType as PurchaseType, value);
    });
  }

  serialize(): IMoneySerializedState {
    return {
      money: this._money,
      income: Object.fromEntries(this._income.entries()) as Record<IncomeSource, number>,
      expenses: Object.fromEntries(this._expenses.entries()) as Record<PurchaseType, number>,
    };
  }
}
