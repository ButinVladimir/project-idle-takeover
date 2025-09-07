import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { Feature } from '@shared/index';
import { type IGlobalState } from '@state/global-state';
import { type IAutomationState } from '@state/automation-state';
import { type IUnlockState } from '@state/unlock-state';
import { IMainframeHardwareParameter, IMainframeHardwareUpgrader } from './interfaces';
import { type IMainframeState } from '../../interfaces';
import { MainframeHardwareParameterType } from './types';

const { lazyInject } = decorators;

export class MainframeHardwareUpgrader implements IMainframeHardwareUpgrader {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  private _availableMoney = 0;

  private _availableActions = 0;

  upgradeMaxAllParameters(): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = Number.MAX_SAFE_INTEGER;

    this.performUpgradeAll();
  }

  upgradeMaxParameter(parameterType: MainframeHardwareParameterType): void {
    if (!this.checkUpgradeAvailable()) {
      return;
    }

    this._availableMoney = this._globalState.money.money;
    this._availableActions = Number.MAX_SAFE_INTEGER;

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
    return this._unlockState.features.isFeatureUnlocked(Feature.mainframeHardware);
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
    const increase = Math.min(parameter.calculateIncreaseFromMoney(this._availableMoney), this._availableActions);

    if (increase > 0) {
      const cost = parameter.calculateIncreaseCost(increase);

      if (parameter.purchase(increase)) {
        this._availableMoney -= cost;
        this._availableActions -= increase;
      }
    }
  }
}
