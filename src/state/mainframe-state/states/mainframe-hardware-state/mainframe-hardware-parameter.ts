import type { IStateUIConnector } from '@state/state-ui-connector';
import type { IGlobalState } from '@state/global-state';
import type { IMessageLogState } from '@state/message-log-state';
import { type IFormatter, IExponent, PurchaseType } from '@shared/index';
import { decorators } from '@state/container';
import { type IScenarioState } from '@state/scenario-state';
import { type IUnlockState } from '@state/unlock-state';
import { TYPES } from '@state/types';
import { IMainframeHardwareParameter, IMainframeHardwareParameterSerializedState } from './interfaces';
import { MainframeHardwareParameterType, MainframeHardwareValidationResult } from './types';
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

  abstract get priceExp(): IExponent;

  protected abstract handlePostUpgrade(): void;

  protected abstract postPurchaseMessage(): void;

  purchase(increase: number): boolean {
    if (
      this.mainframeState.hardware.validator.validateHardware(this.type, increase) !==
      MainframeHardwareValidationResult.valid
    ) {
      return false;
    }

    const cost = this.mainframeState.hardware.validator.calculateIncreaseCost(this.type, increase);

    return this.globalState.money.purchase(cost, PurchaseType.mainframeHardware, this.handlePurchaseIncrease(increase));
  }

  async startNewState(): Promise<void> {
    this._autoUpgradeEnabled = true;
    this._level = 0;

    this.handlePostUpgrade();
  }

  async deserialize(serializedState: IMainframeHardwareParameterSerializedState): Promise<void> {
    this._level = serializedState.level;
    this._autoUpgradeEnabled = serializedState.autoUpgradeEnabled;

    this.handlePostUpgrade();
  }

  serialize(): IMainframeHardwareParameterSerializedState {
    return {
      level: this._level,
      autoUpgradeEnabled: this._autoUpgradeEnabled,
    };
  }

  private handlePurchaseIncrease = (increase: number) => () => {
    this._level += increase;

    this.postPurchaseMessage();
    this.handlePostUpgrade();
  };
}
