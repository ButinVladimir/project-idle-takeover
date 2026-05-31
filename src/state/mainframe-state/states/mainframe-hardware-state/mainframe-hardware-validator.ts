import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { type IMainframeState } from '@state/mainframe-state/interfaces/mainframe-state';
import { TYPES } from '@state/types';
import { calculateGeometricProgressionSum, Milestone } from '@shared/index';
import { IMainframeHardwareParameter, IMainframeHardwareValidator } from './interfaces';
import { MainframeHardwareValidationResult, MainframeHardwareParameterType } from './types';

const { lazyInject } = decorators;

@injectable()
export class MainframeHardwareValidator implements IMainframeHardwareValidator {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  calculateIncreaseCost(parameterType: MainframeHardwareParameterType, increase: number): number {
    const parameter = this.getParameterByType(parameterType);
    const exp = parameter.priceExp;

    return (
      (calculateGeometricProgressionSum(parameter.level + increase - 1, exp.multiplier, exp.base) -
        calculateGeometricProgressionSum(parameter.level - 1, exp.multiplier, exp.base)) /
      this._globalState.multipliers.computationalBase.totalMultiplier
    );
  }

  validateHardware(parameterType: MainframeHardwareParameterType, increase: number): MainframeHardwareValidationResult {
    if (!this._unlockState.milestones.isMilestoneReached(Milestone.unlockedMainframeHardware)) {
      return MainframeHardwareValidationResult.hardwareLocked;
    }

    if (increase <= 0) {
      return MainframeHardwareValidationResult.increaseInvalid;
    }

    const parameter = this.getParameterByType(parameterType);

    if (parameter.level + increase > this._globalState.development.level) {
      return MainframeHardwareValidationResult.higherDevelopmentLevelRequired;
    }

    const cost = this.calculateIncreaseCost(parameterType, increase);

    if (cost > this._globalState.money.money) {
      return MainframeHardwareValidationResult.notEnoughMoney;
    }

    return MainframeHardwareValidationResult.valid;
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
}
