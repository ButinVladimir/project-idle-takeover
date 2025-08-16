import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { binarySearchDecimal, Feature } from '@shared/index';
import { type IGlobalState } from '@state/global-state';
import { type IAutomationState } from '@state/automation-state';
import { IMainframeHardwareParameter, IMainframeHardwareUpgrader } from './interfaces';
import { type IMainframeState } from '../../interfaces';
import { MainframeHardwareParameterType } from './types';

const { lazyInject } = decorators;

export class MainframeHardwareUpgrader implements IMainframeHardwareUpgrader {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  private _availableMoney = 0;

  private _availableActions = 0;

  upgradeMaxAllParameters(): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = this._globalState.development.level * 3;

    this.performUpgradeAll();
  }

  upgradeMaxParameter(parameterType: MainframeHardwareParameterType): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = this._globalState.development.level;

    const parameter = this.getParameterByType(parameterType);

    this.performUpgradeParameter(parameter);
  }

  autoupgrade(actionCount: number): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = (this._globalState.money.money * this._automationState.mainframeHardware.moneyShare) / 100;
    this._availableActions = actionCount;

    this.performUpgradeAll();
  }

  private checkUpgradeAvailable() {
    return this._globalState.unlockedFeatures.isFeatureUnlocked(Feature.mainframeHardware);
  }

  private getParameterByType(parameterType: MainframeHardwareParameterType): IMainframeHardwareParameter {
    switch (parameterType) {
      case 'performance':
        return this._mainframeState.hardware.performance;
      case 'ram':
        return this._mainframeState.hardware.ram;
      case 'cores':
        return this._mainframeState.hardware.cores;
    }
  }

  private performUpgradeAll() {
    for (const parameter of this._mainframeState.hardware.listParameters()) {
      if (this._availableActions <= 0) {
        break;
      }

      if (!parameter.autoUpgradeEnabled) {
        continue;
      }

      this.performUpgradeParameter(parameter);
    }
  }

  private performUpgradeParameter(parameter: IMainframeHardwareParameter) {
    const checkParameter = this.makeCheckParameterFunction(parameter);

    const maxIncrease = Math.min(this._globalState.development.level - parameter.level, this._availableActions);

    const increase = binarySearchDecimal(0, maxIncrease, checkParameter);

    if (increase > 0) {
      const cost = parameter.getIncreaseCost(increase);

      if (parameter.purchase(increase)) {
        this._availableMoney -= cost;
        this._availableActions -= increase;
      }
    }
  }

  private makeCheckParameterFunction =
    (parameter: IMainframeHardwareParameter) =>
    (increase: number): boolean => {
      const cost = parameter.getIncreaseCost(increase);

      return cost <= this._availableMoney;
    };
}
