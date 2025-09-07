import type { IStateUIConnector } from '@state/state-ui-connector';
import type { IGlobalState } from '@state/global-state';
import type { IMessageLogState } from '@state/message-log-state';
import {
  type IFormatter,
  calculateGeometricProgressionSum,
  IExponent,
  Feature,
  PurchaseType,
  reverseGeometricProgressionSum,
} from '@shared/index';
import { decorators } from '@state/container';
import { type IScenarioState } from '@state/scenario-state';
import { type IUnlockState } from '@state/unlock-state';
import { TYPES } from '@state/types';
import { IMainframeHardwareParameter, IMainframeHardwareParameterSerializedState } from './interfaces';
import { MainframeHardwareParameterType } from './types';
import { type IMainframeState } from '../../interfaces';

const { lazyInject } = decorators;

export abstract class MainframeHardwareParameter implements IMainframeHardwareParameter {
  @lazyInject(TYPES.StateUIConnector)
  protected stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.MainframeState)
  protected mainframeState!: IMainframeState;

  @lazyInject(TYPES.GlobalState)
  protected globalState!: IGlobalState;

  @lazyInject(TYPES.ScenarioState)
  protected scenarioState!: IScenarioState;

  @lazyInject(TYPES.UnlockState)
  protected unlockState!: IUnlockState;

  @lazyInject(TYPES.MessageLogState)
  protected messageLogState!: IMessageLogState;

  @lazyInject(TYPES.Formatter)
  protected formatter!: IFormatter;

  protected _level: number;
  protected _autoUpgradeEnabled: boolean;

  constructor() {
    this._level = 0;
    this._autoUpgradeEnabled = true;

    this.stateUiConnector.registerEventEmitter(this, ['_level', '_autoUpgradeEnabled']);
  }

  get level() {
    return this._level;
  }

  protected abstract get baseLevel(): number;

  get totalLevel() {
    return this._level + this.baseLevel;
  }

  get autoUpgradeEnabled() {
    return this._autoUpgradeEnabled;
  }

  set autoUpgradeEnabled(value: boolean) {
    this._autoUpgradeEnabled = value;
  }

  abstract get type(): MainframeHardwareParameterType;

  protected abstract get priceExp(): IExponent;

  protected abstract postPurchaseMessge(): void;

  calculateIncreaseCost(increase: number): number {
    const exp = this.priceExp;

    return (
      (calculateGeometricProgressionSum(this.level + increase - 1, exp.multiplier, exp.base) -
        calculateGeometricProgressionSum(this.level - 1, exp.multiplier, exp.base)) /
      this.globalState.multipliers.computationalBase.totalMultiplier
    );
  }

  calculateIncreaseFromMoney(money: number): number {
    const exp = this.priceExp;

    const availableMoney =
      money * this.globalState.multipliers.computationalBase.totalMultiplier +
      calculateGeometricProgressionSum(this.level - 1, exp.multiplier, exp.base);

    const increase = reverseGeometricProgressionSum(availableMoney, exp.multiplier, exp.base) - this.level;

    return increase;
  }

  purchase(increase: number): boolean {
    if (!this.checkCanPurchase(increase)) {
      return false;
    }

    const cost = this.calculateIncreaseCost(increase);

    return this.globalState.money.purchase(cost, PurchaseType.mainframeHardware, this.handlePurchaseIncrease(increase));
  }

  checkCanPurchase = (increase: number): boolean => {
    if (increase <= 0) {
      return false;
    }

    if (!this.unlockState.features.isFeatureUnlocked(Feature.mainframeHardware)) {
      return false;
    }

    const cost = this.calculateIncreaseCost(increase);

    return cost <= this.globalState.money.money;
  };

  async startNewState(): Promise<void> {
    this._autoUpgradeEnabled = true;
    this._level = 0;
  }

  async deserialize(serializedState: IMainframeHardwareParameterSerializedState): Promise<void> {
    this._level = serializedState.level;
    this._autoUpgradeEnabled = serializedState.autoUpgradeEnabled;
  }

  serialize(): IMainframeHardwareParameterSerializedState {
    return {
      level: this._level,
      autoUpgradeEnabled: this._autoUpgradeEnabled,
    };
  }

  private handlePurchaseIncrease = (increase: number) => () => {
    this._level += increase;
    this.postPurchaseMessge();

    this.globalState.processCompletionSpeed.requestRecalculation();
    this.mainframeState.processes.requestUpdateRunningProcesses();
    this.mainframeState.processes.updateAllProcessesPerformance();
  };
}
