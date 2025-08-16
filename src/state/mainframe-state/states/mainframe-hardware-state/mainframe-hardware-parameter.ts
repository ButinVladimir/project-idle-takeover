import type { IStateUIConnector } from '@state/state-ui-connector';
import type { IGlobalState } from '@state/global-state';
import type { IMessageLogState } from '@state/message-log-state';
import { type IFormatter, calculateGeometricProgressionSum, IExponent, Feature, PurchaseType } from '@shared/index';
import { decorators } from '@state/container';
import { IMainframeHardwareParameter, IMainframeHardwareParameterSerializedState } from './interfaces';
import { MainframeHardwareParameterType } from './types';
import { type IMainframeState } from '../../interfaces';
import { TYPES } from '@/state/types';

const { lazyInject } = decorators;

export abstract class MainframeHardwareParameter implements IMainframeHardwareParameter {
  @lazyInject(TYPES.StateUIConnector)
  protected stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.MainframeState)
  protected mainframeState!: IMainframeState;

  @lazyInject(TYPES.GlobalState)
  protected globalState!: IGlobalState;

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

  getIncreaseCost(increase: number): number {
    const exp = this.priceExp;

    return (
      (calculateGeometricProgressionSum(this.level + increase - 1, exp.multiplier, exp.base) -
        calculateGeometricProgressionSum(this.level - 1, exp.multiplier, exp.base)) /
      this.globalState.multipliers.computationalBase.totalMultiplier
    );
  }

  purchase(increase: number): boolean {
    if (!this.checkCanPurchase(increase)) {
      return false;
    }

    const cost = this.getIncreaseCost(increase);

    return this.globalState.money.purchase(cost, PurchaseType.mainframeHardware, this.handlePurchaseIncrease(increase));
  }

  checkCanPurchase = (increase: number): boolean => {
    if (increase <= 0) {
      return false;
    }

    if (!this.globalState.unlockedFeatures.isFeatureUnlocked(Feature.mainframeHardware)) {
      return false;
    }

    const maxIncrease = this.globalState.development.level - this.level;

    if (increase > maxIncrease) {
      return false;
    }

    const cost = this.getIncreaseCost(increase);

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

    this.mainframeState.processes.requestUpdateProcesses();
    this.mainframeState.processes.requestUpdatePerformance();
  };
}
