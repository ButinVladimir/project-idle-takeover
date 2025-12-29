import { MainframeHardwareParameterType } from '../types';

export interface IMainframeHardwareUpgrader {
  upgradeMaxAllParameters(): void;
  upgradeMaxParameter(parameterType: MainframeHardwareParameterType): void;
  autoupgrade(actionCount: number): void;
}
