import { MainframeHardwareParameterType, MainframeHardwareValidationResult } from '@state/mainframe-state';
import { BaseController } from '@shared/index';

export class MainframeHardwarePanelArticleButtonsController extends BaseController {
  get developmentLevel() {
    return this.globalState.development.level;
  }

  get money(): number {
    return this.globalState.money.money;
  }

  get moneyGrowth(): number {
    return this.growthState.money.totalGrowth;
  }

  calculateIncreaseFromMoney(parameterType: MainframeHardwareParameterType): number {
    return this.mainframeState.hardware.upgrader.calculateIncreaseFromMoney(
      parameterType,
      this.globalState.money.money,
    );
  }

  calculateIncreaseCost(parameterType: MainframeHardwareParameterType, increase: number): number {
    return this.mainframeState.hardware.validator.calculateIncreaseCost(parameterType, increase);
  }

  validate(parameterType: MainframeHardwareParameterType, increase: number): MainframeHardwareValidationResult {
    return this.mainframeState.hardware.validator.validateHardware(parameterType, increase);
  }
}
