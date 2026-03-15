import { MainframeHardwareParameterType, MainframeHardwareValidationResult } from '../types';

export interface IMainframeHardwareValidator {
  calculateIncreaseCost(parameterType: MainframeHardwareParameterType, increase: number): number;
  validateHardware(parameterType: MainframeHardwareParameterType, increase: number): MainframeHardwareValidationResult;
}
